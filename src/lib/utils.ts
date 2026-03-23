import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PLAN_CREDITS: Record<string, number> = {
  FREE: 3,
  STARTER: 30,
  PRO: 100,
  STUDIO: 500,
}

export const PLAN_PRICES: Record<string, { monthly: number; name: string }> = {
  STARTER: { monthly: 29, name: 'Starter' },
  PRO: { monthly: 79, name: 'Pro' },
  STUDIO: { monthly: 199, name: 'Studio' },
}

export const ROOM_TYPES = [
  'Salon', 'Chambre', 'Cuisine', 'Salle de bain', 'Bureau',
  'Salle à manger', 'Entrée', 'Terrasse', 'Jardin', 'Autre',
]

export const STYLES = [
  'Moderne', 'Scandinave', 'Industriel', 'Bohème', 'Classique',
  'Minimaliste', 'Art Déco', 'Japandi', 'Mid-Century', 'Rustique',
  'Contemporain', 'Méditerranéen', 'Tropical', 'Côtier', 'Luxe',
]

// Formats structurés pour les nouveaux composants
export const DESIGN_STYLES = STYLES.map((s) => ({ value: s.toLowerCase().replace(/\s+/g, '-'), label: s }))
export const ROOM_CATEGORIES = ROOM_TYPES.map((r) => ({ value: r.toLowerCase().replace(/\s+/g, '-'), label: r }))
