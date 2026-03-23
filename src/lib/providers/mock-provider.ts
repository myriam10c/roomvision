// ============================================================
// RoomVision — Mock Provider (dev/test)
// ============================================================

import { ImageProvider } from './types';
import {
  GenerationInput,
  GenerationOutput,
  CostEstimate,
  ProviderStatus,
  GeneratedVariant,
} from '@/types/generation';
import { buildStructuredPrompt } from '@/lib/generation/prompt-builder';

/**
 * Provider Mock pour le développement et les tests.
 * Retourne des images placeholder sans appeler d'API externe.
 * Simule un délai de traitement réaliste.
 */
export class MockProvider implements ImageProvider {
  readonly name = 'mock';
  readonly displayName = 'Mock (Dev)';

  isConfigured(): boolean {
    return true; // Toujours disponible
  }

  async checkAvailability(): Promise<ProviderStatus> {
    return { name: this.name, available: true };
  }

  estimateCost(input: GenerationInput): CostEstimate {
    return {
      provider: this.name,
      estimatedCents: 0,
      creditsRequired: 1,
    };
  }

  async generate(input: GenerationInput): Promise<GenerationOutput> {
    const startTime = Date.now();
    const prompt = buildStructuredPrompt(input);

    // Simuler un délai de traitement (1-3 secondes)
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 2000));

    const variants: GeneratedVariant[] = [];
    for (let i = 0; i < input.numVariants; i++) {
      // Générer une URL placeholder avec les paramètres encodés
      const params = new URLSearchParams({
        text: `RoomVision Variant ${i + 1}\n${input.style || 'Modern'}\n${input.intensity}`,
        w: '1024',
        h: '768',
      });

      variants.push({
        imageData: `https://placehold.co/1024x768/1a1a2e/d4a574?${params.toString()}`,
        format: 'url',
        mimeType: 'image/png',
        seed: `mock-${i}-${Date.now()}`,
      });
    }

    return {
      variants,
      provider: this.name,
      processingTimeMs: Date.now() - startTime,
      costCents: 0,
      finalPrompt: prompt,
      metadata: { mock: true },
    };
  }
}
