// ============================================================
// RoomVision — Generation Pipeline
// Orchestrateur principal du workflow de génération
// ============================================================

import { ProviderFactory } from '@/lib/providers/provider-factory';
import { GenerationInput, GenerationOutput } from '@/types/generation';
import { deductCredits } from '@/lib/credits';
import { prisma } from '@/lib/prisma';
import { uploadBase64Image } from '@/lib/storage';

export interface PipelineInput {
  userId: string;
  roomId: string;
  generationId: string;
  roomImageUrl: string;
  referenceImageUrls: string[];
  userPrompt?: string;
  style?: string;
  transformationType: 'FAITHFUL' | 'CREATIVE';
  intensity: 'LOW' | 'MEDIUM' | 'HIGH';
  numVariants: number;
  roomType?: string;
  providerName?: string; // Forcer un provider spécifique
}

/**
 * Pipeline de génération complet.
 *
 * 1. Vérifie les crédits
 * 2. Sélectionne le provider
 * 3. Lance la génération
 * 4. Upload les résultats vers Supabase Storage
 * 5. Sauvegarde les variantes en DB
 * 6. Déduit les crédits
 * 7. Met à jour le statut
 */
export async function runGenerationPipeline(
  input: PipelineInput
): Promise<GenerationOutput> {
  const { userId, roomId, generationId } = input;

  try {
    // 1. Marquer la génération comme PROCESSING
    await prisma.$queryRaw`
      UPDATE generations
      SET status = 'PROCESSING'::"GenerationStatus"
      WHERE id = ${generationId}
    `;

    // 2. Sélectionner le provider
    const provider = input.providerName
      ? ProviderFactory.get(input.providerName)
      : await ProviderFactory.getAvailable();

    // 3. Préparer l'input pour le provider
    const generationInput: GenerationInput = {
      roomImageUrl: input.roomImageUrl,
      referenceImageUrls: input.referenceImageUrls,
      userPrompt: input.userPrompt,
      style: input.style,
      transformationType: input.transformationType,
      intensity: input.intensity,
      numVariants: input.numVariants,
      roomType: input.roomType,
    };

    // 4. Lancer la génération
    const output = await provider.generate(generationInput);

    // 5. Upload les variantes vers Supabase Storage et créer les records
    const variantRecords = [];
    for (let i = 0; i < output.variants.length; i++) {
      const variant = output.variants[i];
      let imageUrl = variant.imageData;

      // Si le résultat est en base64, uploader vers Storage
      if (variant.format === 'base64') {
        const storagePath = `renders/${userId}/${generationId}/variant-${i}.${getExtension(variant.mimeType)}`;
        imageUrl = await uploadBase64Image(
          variant.imageData,
          variant.mimeType,
          storagePath
        );
      }

      // Créer le record en DB
      const record = await prisma.$queryRaw`
        INSERT INTO generation_variants (id, image_url, generation_id, created_at)
        VALUES (gen_random_uuid()::text, ${imageUrl}, ${generationId}, now())
        RETURNING id, image_url, generation_id, created_at
      `;
      variantRecords.push(record);
    }

    // 6. Déduire les crédits
    await deductCredits(userId, 1, `Generation ${generationId}`);

    // 7. Mettre à jour la génération comme COMPLETED
    await prisma.$queryRaw`
      UPDATE generations
      SET status = 'COMPLETED'::"GenerationStatus",
          provider_used = ${provider.name},
          processing_time_ms = ${output.processingTimeMs},
          cost_cents = ${output.costCents}
      WHERE id = ${generationId}
    `;

    return output;
  } catch (error) {
    // En cas d'erreur, marquer la génération comme FAILED
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await prisma.$queryRaw`
      UPDATE generations
      SET status = 'FAILED'::"GenerationStatus",
          error_message = ${errorMsg}
      WHERE id = ${generationId}
    `;
    throw error;
  }
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
  };
  return map[mimeType] || 'png';
}
