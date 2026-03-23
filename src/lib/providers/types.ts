// ============================================================
// RoomVision — Interface commune des providers IA image
// ============================================================

import {
  GenerationInput,
  GenerationOutput,
  CostEstimate,
  ProviderStatus,
} from '@/types/generation';

/**
 * Interface commune que chaque provider d'images IA doit implémenter.
 *
 * Cette abstraction permet de brancher Gemini, OpenAI, FLUX ou tout
 * autre provider sans modifier le code du pipeline de génération.
 */
export interface ImageProvider {
  /** Nom unique du provider */
  readonly name: string;

  /** Description lisible */
  readonly displayName: string;

  /**
   * Génère des variantes d'image à partir des inputs.
   * C'est le point d'entrée principal.
   */
  generate(input: GenerationInput): Promise<GenerationOutput>;

  /**
   * Estime le coût d'une génération sans l'exécuter.
   */
  estimateCost(input: GenerationInput): CostEstimate;

  /**
   * Vérifie si le provider est disponible (clé API valide, service up).
   */
  checkAvailability(): Promise<ProviderStatus>;

  /**
   * Retourne true si le provider est configuré (clé API présente).
   */
  isConfigured(): boolean;
}

/** Configuration de base partagée par tous les providers */
export interface BaseProviderConfig {
  apiKey: string;
  maxRetries: number;
  timeoutMs: number;
}

/** Options de fallback entre providers */
export interface ProviderFallbackConfig {
  /** Provider primaire */
  primary: string;
  /** Providers de secours dans l'ordre */
  fallbacks: string[];
  /** Activer le fallback automatique */
  autoFallback: boolean;
}
