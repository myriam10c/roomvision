// ============================================================
// RoomVision — Types principaux
// ============================================================

// ---- Enums ----

export type Plan = 'FREE' | 'STARTER' | 'PRO' | 'STUDIO';
export type GenerationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type TransformationType = 'FAITHFUL' | 'CREATIVE';
export type Intensity = 'LOW' | 'MEDIUM' | 'HIGH';
export type RefImageType = 'MOODBOARD' | 'REFERENCE' | 'ROOM_PHOTO';
export type CreditTransactionType = 'PURCHASE' | 'USAGE' | 'REFUND' | 'MONTHLY_RESET';
export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

// ---- User ----

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  plan: Plan;
  credits: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentTeamId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Project ----

export interface Project {
  id: string;
  name: string;
  description: string | null;
  clientName: string | null;
  coverUrl: string | null;
  userId: string;
  teamId: string | null;
  createdAt: string;
  updatedAt: string;
  rooms?: Room[];
  _count?: { rooms: number; };
}

// ---- Room ----

export interface Room {
  id: string;
  name: string;
  description: string | null;
  photoUrl: string | null;
  roomType: string | null;
  notes: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  generations?: Generation[];
  referenceImages?: ReferenceImage[];
  _count?: { generations: number; };
}

// ---- Generation ----

export interface Generation {
  id: string;
  prompt: string | null;
  style: string | null;
  moodboardUrl: string | null;
  status: GenerationStatus;
  transformationType: TransformationType;
  intensity: Intensity;
  creditsUsed: number;
  providerUsed: string | null;
  processingTimeMs: number | null;
  costCents: number | null;
  errorMessage: string | null;
  roomId: string;
  userId: string;
  createdAt: string;
  variants?: GenerationVariant[];
  referenceImages?: ReferenceImage[];
  room?: Room;
}

// ---- Generation Variant ----

export interface GenerationVariant {
  id: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  generationId: string;
  createdAt: string;
}

// ---- Reference Image ----

export interface ReferenceImage {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  type: RefImageType;
  generationId: string | null;
  roomId: string | null;
  createdAt: string;
}

// ---- Recipe ----

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  prompt: string;
  style: string | null;
  roomType: string | null;
  intensity: Intensity;
  transformationType: TransformationType;
  referenceUrls: string[];
  thumbnailUrl: string | null;
  isPublic: boolean;
  userId: string;
  createdAt: string;
}

// ---- Favorite ----

export interface Favorite {
  id: string;
  userId: string;
  generationId: string;
  createdAt: string;
  generation?: Generation;
}

// ---- Credit Transaction ----

export interface CreditTransaction {
  id: string;
  amount: number;
  type: CreditTransactionType;
  reason: string | null;
  userId: string;
  createdAt: string;
}

// ---- Team (B2B prep) ----

export interface Team {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  role: TeamRole;
  userId: string;
  teamId: string;
  joinedAt: string;
  user?: User;
}
