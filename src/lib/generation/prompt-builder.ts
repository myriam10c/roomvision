// ============================================================
// RoomVision — Prompt Builder
// Construit des prompts structurés pour la génération IA
// ============================================================

import { GenerationInput } from '@/types/generation';
import { DESIGN_STYLES, ROOM_CATEGORIES } from '@/lib/utils';

/**
 * Construit un prompt structuré optimisé pour la génération
 * de rendus d'intérieur réalistes.
 *
 * Le prompt est divisé en sections claires pour guider l'IA :
 * 1. Contexte & rôle
 * 2. Instructions de préservation structurelle
 * 3. Instructions de transformation stylistique
 * 4. Calibrage d'intensité
 * 5. Exigences de qualité
 */
export function buildStructuredPrompt(input: GenerationInput): string {
  const {
    style,
    transformationType,
    intensity,
    roomType,
    userPrompt,
    referenceImageUrls,
  } = input;

  const roomLabel = getRoomLabel(roomType);
  const styleLabel = getStyleLabel(style);
  const intensityConfig = getIntensityConfig(intensity);
  const transformConfig = getTransformConfig(transformationType);

  const sections: string[] = [];

  // ---- Section 1 : Contexte ----
  sections.push(
    `You are an expert interior designer and architectural visualizer. ` +
    `Your task is to create a photorealistic visualization of a ${roomLabel} transformation.`
  );

  // ---- Section 2 : Préservation structurelle ----
  sections.push(
    `STRUCTURAL PRESERVATION (${transformConfig.label}):\n` +
    `${transformConfig.instructions}\n` +
    `- Maintain the exact camera angle and perspective of the source photo\n` +
    `- Preserve all windows, doors, and openings in their exact positions\n` +
    `- Keep ceiling height, floor area, and room proportions identical\n` +
    `- ${transformConfig.architecturalNote}`
  );

  // ---- Section 3 : Transformation stylistique ----
  sections.push(
    `STYLE TRANSFORMATION:\n` +
    `- Target style: ${styleLabel}\n` +
    `- ${intensityConfig.furnitureNote}\n` +
    `- ${intensityConfig.materialsNote}\n` +
    `- ${intensityConfig.colorNote}\n` +
    `- ${intensityConfig.lightingNote}\n` +
    `- ${intensityConfig.atmosphereNote}`
  );

  // ---- Section 4 : Références ----
  if (referenceImageUrls.length > 0) {
    sections.push(
      `REFERENCE IMAGES PROVIDED: ${referenceImageUrls.length} reference(s).\n` +
      `Extract and faithfully reproduce from these references:\n` +
      `- The exact color palette and tonal range\n` +
      `- Material choices (wood type, stone, fabric textures)\n` +
      `- Furniture style, proportions, and arrangement logic\n` +
      `- Lighting mood and quality (warm, cool, dramatic, soft)\n` +
      `- Decorative elements and accessories level\n` +
      `- Overall sense of luxury/simplicity/warmth`
    );
  }

  // ---- Section 5 : Prompt utilisateur ----
  if (userPrompt?.trim()) {
    sections.push(
      `DESIGNER'S SPECIFIC INSTRUCTIONS:\n${userPrompt.trim()}`
    );
  }

  // ---- Section 6 : Qualité output ----
  sections.push(
    `OUTPUT REQUIREMENTS:\n` +
    `- Photorealistic interior photograph quality\n` +
    `- Professional architectural photography lighting\n` +
    `- Magazine-quality composition\n` +
    `- High resolution, sharp details\n` +
    `- Natural, believable result that a client would trust\n` +
    `- No visible AI artifacts, distortions, or unrealistic elements`
  );

  return sections.join('\n\n');
}

// ---- Helpers ----

function getRoomLabel(roomType?: string): string {
  if (!roomType) return 'room';
  const found = ROOM_CATEGORIES.find((r) => r.value === roomType);
  return found ? found.label.toLowerCase() : roomType.toLowerCase();
}

function getStyleLabel(style?: string): string {
  if (!style) return 'Modern Contemporary';
  const found = DESIGN_STYLES.find((s) => s.value === style);
  return found ? found.label : style;
}

interface IntensityConfig {
  furnitureNote: string;
  materialsNote: string;
  colorNote: string;
  lightingNote: string;
  atmosphereNote: string;
}

function getIntensityConfig(intensity: string): IntensityConfig {
  switch (intensity) {
    case 'LOW':
      return {
        furnitureNote: 'Keep existing furniture layout, update only finishes and textiles',
        materialsNote: 'Subtle material upgrades (similar family, refined quality)',
        colorNote: 'Shift color palette gently toward target style',
        lightingNote: 'Adjust lighting warmth/coolness slightly',
        atmosphereNote: 'Gentle atmosphere shift, same overall energy',
      };
    case 'HIGH':
      return {
        furnitureNote: 'Complete furniture replacement with style-appropriate pieces',
        materialsNote: 'Full material overhaul (floors, walls, fixtures, hardware)',
        colorNote: 'Completely new color palette matching target style',
        lightingNote: 'Redesign lighting scheme (fixtures, ambiance, layering)',
        atmosphereNote: 'Total atmosphere transformation to match references',
      };
    default: // MEDIUM
      return {
        furnitureNote: 'Replace key furniture pieces, keep layout structure',
        materialsNote: 'Update primary materials (walls, floors, major surfaces)',
        colorNote: 'Apply target color palette to dominant surfaces',
        lightingNote: 'Update lighting fixtures and adjust mood',
        atmosphereNote: 'Clear style shift while maintaining spatial comfort',
      };
  }
}

interface TransformConfig {
  label: string;
  instructions: string;
  architecturalNote: string;
}

function getTransformConfig(type: string): TransformConfig {
  if (type === 'CREATIVE') {
    return {
      label: 'Creative Reinterpretation',
      instructions:
        'You have creative freedom to reimagine the space while respecting ' +
        'the fundamental room structure. Minor layout adjustments are acceptable.',
      architecturalNote:
        'Architectural features can be subtly enhanced or simplified to serve the design vision',
    };
  }

  return {
    label: 'Faithful Transformation',
    instructions:
      'Strictly preserve every architectural element of the source room. ' +
      'The output must look like the same room with a complete design makeover.',
    architecturalNote:
      'All architectural details (moldings, beams, niches, columns) must remain exactly as in the source',
  };
}
