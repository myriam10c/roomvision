// ============================================================
// RoomVision — Gemini Provider (Google AI)
// ============================================================

import { ImageProvider, BaseProviderConfig } from './types';
import {
  GenerationInput,
  GenerationOutput,
  CostEstimate,
  ProviderStatus,
  GeneratedVariant,
} from '@/types/generation';
import { buildStructuredPrompt } from '@/lib/generation/prompt-builder';

const DEFAULT_CONFIG: BaseProviderConfig = {
  apiKey: process.env.GEMINI_API_KEY || '',
  maxRetries: 2,
  timeoutMs: 120_000, // 2 minutes
};

/**
 * Provider Gemini — utilise l'API Gemini (Imagen 3 / Gemini 2.0 Flash)
 * pour la génération d'images à partir de prompts multimodaux.
 *
 * Gemini est particulièrement adapté car il accepte nativement
 * des images en entrée (multimodal), ce qui permet d'envoyer
 * la photo de la pièce + les références directement.
 */
export class GeminiProvider implements ImageProvider {
  readonly name = 'gemini';
  readonly displayName = 'Google Gemini';
  private config: BaseProviderConfig;

  constructor(config?: Partial<BaseProviderConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  async checkAvailability(): Promise<ProviderStatus> {
    if (!this.isConfigured()) {
      return { name: this.name, available: false, reason: 'API key not configured' };
    }
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${this.config.apiKey}`,
        { signal: AbortSignal.timeout(10_000) }
      );
      return {
        name: this.name,
        available: res.ok,
        reason: res.ok ? undefined : `HTTP ${res.status}`,
      };
    } catch (err) {
      return { name: this.name, available: false, reason: String(err) };
    }
  }

  estimateCost(input: GenerationInput): CostEstimate {
    // Gemini Imagen: ~$0.04 par image générée (estimation)
    const costPerImage = 4; // centimes
    return {
      provider: this.name,
      estimatedCents: costPerImage * input.numVariants,
      creditsRequired: 1,
    };
  }

  async generate(input: GenerationInput): Promise<GenerationOutput> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is not configured');
    }

    const startTime = Date.now();
    const structuredPrompt = buildStructuredPrompt(input);
    const variants: GeneratedVariant[] = [];

    // Construire les parts multimodaux pour Gemini
    const parts = await this.buildMultimodalParts(input, structuredPrompt);

    // Générer chaque variante
    for (let i = 0; i < input.numVariants; i++) {
      const variant = await this.generateSingleVariant(parts, i);
      variants.push(variant);
    }

    const processingTimeMs = Date.now() - startTime;
    const cost = this.estimateCost(input);

    return {
      variants,
      provider: this.name,
      processingTimeMs,
      costCents: cost.estimatedCents,
      finalPrompt: structuredPrompt,
      metadata: {
        model: 'gemini-2.5-flash-image',
        numVariants: input.numVariants,
      },
    };
  }

  /**
   * Construit les "parts" multimodaux pour l'API Gemini.
   * Inclut : prompt texte + image de la pièce + références.
   */
  private async buildMultimodalParts(
    input: GenerationInput,
    prompt: string
  ): Promise<GeminiPart[]> {
    const parts: GeminiPart[] = [];

    // 1. Prompt texte structuré
    parts.push({ text: prompt });

    // 2. Image de la pièce source
    if (input.roomImageUrl) {
      const imageData = await this.fetchImageAsBase64(input.roomImageUrl);
      if (imageData) {
        parts.push({
          inlineData: {
            mimeType: imageData.mimeType,
            data: imageData.base64,
          },
        });
        parts.push({ text: 'This is the source room photo. Preserve its exact geometry, perspective, and architectural elements.' });
      }
    }

    // 3. Images de référence / moodboard
    for (const refUrl of input.referenceImageUrls.slice(0, 4)) {
      const imageData = await this.fetchImageAsBase64(refUrl);
      if (imageData) {
        parts.push({
          inlineData: {
            mimeType: imageData.mimeType,
            data: imageData.base64,
          },
        });
        parts.push({ text: 'This is a style reference. Extract the aesthetic, materials, colors, and atmosphere from this image.' });
      }
    }

    return parts;
  }

  /**
   * Génère une seule variante via l'API Gemini.
   */
  private async generateSingleVariant(
    parts: GeminiPart[],
    index: number
  ): Promise<GeneratedVariant> {
    const variantParts = [
      ...parts,
      { text: `Generate variant ${index + 1}. Create a unique interpretation while maintaining the same style direction.` },
    ];

    const response = await this.callGeminiAPI(variantParts);

    // Extraire l'image de la réponse
    const imageCandidate = response.candidates?.[0]?.content?.parts?.find(
      (p: GeminiResponsePart) => p.inlineData?.mimeType?.startsWith('image/')
    );

    if (imageCandidate?.inlineData) {
      return {
        imageData: imageCandidate.inlineData.data,
        format: 'base64',
        mimeType: imageCandidate.inlineData.mimeType,
        seed: `gemini-${index}-${Date.now()}`,
      };
    }

    // Fallback : si Gemini retourne du texte au lieu d'une image
    throw new Error(`Gemini did not return an image for variant ${index + 1}`);
  }

  /**
   * Appelle l'API Gemini avec retry.
   */
  private async callGeminiAPI(parts: GeminiPart[]): Promise<GeminiResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${this.config.apiKey}`;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE'],
              temperature: 0.8 + (attempt * 0.1), // Légère variation par retry
              maxOutputTokens: 8192,
            },
          }),
          signal: AbortSignal.timeout(this.config.timeoutMs),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Gemini API error ${res.status}: ${errorText}`);
        }

        return (await res.json()) as GeminiResponse;
      } catch (err) {
        lastError = err as Error;
        if (attempt < this.config.maxRetries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error('Gemini API call failed');
  }

  /**
   * Télécharge une image et la convertit en base64.
   */
  private async fetchImageAsBase64(
    url: string
  ): Promise<{ base64: string; mimeType: string } | null> {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) return null;

      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = res.headers.get('content-type') || 'image/jpeg';

      return { base64, mimeType };
    } catch {
      console.error(`Failed to fetch image: ${url}`);
      return null;
    }
  }
}

// ---- Types internes Gemini ----

interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface GeminiResponsePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: GeminiResponsePart[];
    };
  }>;
}
