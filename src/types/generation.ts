// ============================================================
// RoomVision — Types spécifiques à la génération IA
// ============================================================

import { Intensity, TransformationType } from './index';

/** Entrée pour le pipeline de génération */
export interface GenerationInput {
  /** URL de la photo de la pièce source */
  roomImageUrl: string;
  /** URLs des images de référence / moodboard */
  referenceImageUrls: string[];
  /** Prompt texte libre de l'utilisateur */
  userPrompt?: string;
  /** Style prédéfini sélectionné */
  style?: string;
  /** Type de transformation */
  transformationType: TransformationType;
  /** Intensité de la transformation */
  intensity: Intensity;
  /** Nombre de variantes à générer (2-4) */
  numVariants: number;
  /** Type de pièce (pour le contexte du prompt) */
  roomType?: string;
}

/** Sortie du pipeline de génération */
export interface GenerationOutput {
  /** Variantes générées */
  variants: GeneratedVariant[];
  /** Provider utilisé */
  provider: string;
  /** Temps de traitement en ms */
  processingTimeMs: number;
  /** Coût estimé en centimes */
  costCents: number;
  /** Prompt final envoyé au provider */
  finalPrompt: string;
  /** Métadonnées supplémentaires */
  metadata?: Record<string, unknown>;
}

/** Une variante générée */
export interface GeneratedVariant {
  /** Image en base64 ou URL */
  imageData: string;
  /** Format de l'image (base64 ou url) */
  format: 'base64' | 'url';
  /** Seed utilisé (pour reproduction) */
  seed?: string;
  /** MIME type */
  mimeType: string;
}

/** Configuration d'un provider */
export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxRetries?: number;
  timeoutMs?: number;
}

/** Statut de disponibilité d'un provider */
export interface ProviderStatus {
  name: string;
  available: boolean;
  reason?: string;
}

/** Paramètres de prompt structuré */
export interface StructuredPrompt {
  context: string;
  structure: string;
  style: string;
  atmosphere: string;
  details: string;
  quality: string;
  intensity: string;
}

/** Estimation de coût avant génération */
export interface CostEstimate {
  provider: string;
  estimatedCents: number;
  creditsRequired: number;
}
