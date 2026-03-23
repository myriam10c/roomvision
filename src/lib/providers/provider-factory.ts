// ============================================================
// RoomVision — Provider Factory
// ============================================================

import { ImageProvider, ProviderFallbackConfig } from './types';
import { GeminiProvider } from './gemini-provider';
import { MockProvider } from './mock-provider';
import { ProviderStatus } from '@/types/generation';

/** Registry de tous les providers disponibles */
const PROVIDER_REGISTRY: Record<string, () => ImageProvider> = {
  gemini: () => new GeminiProvider(),
  mock: () => new MockProvider(),
  // openai: () => new OpenAIProvider(),  // À ajouter
  // flux: () => new FluxProvider(),      // À ajouter
};

/** Config de fallback par défaut */
const DEFAULT_FALLBACK: ProviderFallbackConfig = {
  primary: 'gemini',
  fallbacks: ['mock'],
  autoFallback: true,
};

/**
 * Factory pour créer et gérer les providers d'images IA.
 *
 * Usage:
 *   const provider = ProviderFactory.get('gemini');
 *   const result = await provider.generate(input);
 *
 * Avec fallback automatique:
 *   const provider = await ProviderFactory.getAvailable();
 */
export class ProviderFactory {
  private static instances: Map<string, ImageProvider> = new Map();

  /**
   * Retourne un provider par nom.
   * Utilise un cache singleton pour chaque provider.
   */
  static get(name: string): ImageProvider {
    if (!this.instances.has(name)) {
      const factory = PROVIDER_REGISTRY[name];
      if (!factory) {
        throw new Error(
          `Unknown provider: "${name}". Available: ${Object.keys(PROVIDER_REGISTRY).join(', ')}`
        );
      }
      this.instances.set(name, factory());
    }
    return this.instances.get(name)!;
  }

  /**
   * Retourne le premier provider disponible selon la config de fallback.
   * Vérifie la configuration (clé API) puis la disponibilité.
   */
  static async getAvailable(
    config: ProviderFallbackConfig = DEFAULT_FALLBACK
  ): Promise<ImageProvider> {
    const order = [config.primary, ...config.fallbacks];

    for (const name of order) {
      try {
        const provider = this.get(name);
        if (!provider.isConfigured()) continue;

        const status = await provider.checkAvailability();
        if (status.available) return provider;
      } catch {
        continue;
      }
    }

    // Dernier recours : mock provider
    return this.get('mock');
  }

  /**
   * Retourne le statut de tous les providers configurés.
   */
  static async getAllStatus(): Promise<ProviderStatus[]> {
    const statuses: ProviderStatus[] = [];

    for (const name of Object.keys(PROVIDER_REGISTRY)) {
      try {
        const provider = this.get(name);
        if (provider.isConfigured()) {
          const status = await provider.checkAvailability();
          statuses.push(status);
        } else {
          statuses.push({ name, available: false, reason: 'Not configured' });
        }
      } catch (err) {
        statuses.push({ name, available: false, reason: String(err) });
      }
    }

    return statuses;
  }

  /**
   * Liste les noms de tous les providers enregistrés.
   */
  static listProviders(): string[] {
    return Object.keys(PROVIDER_REGISTRY);
  }
}
