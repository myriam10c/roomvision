// ============================================================
// RoomVision — Storage Service (Supabase Storage)
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client admin pour les opérations storage côté serveur
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/** Bucket unique Supabase Storage */
export const BUCKETS = {
  ROOM_PHOTOS: 'roomvision',
  MOODBOARDS: 'roomvision',
  RENDERS: 'roomvision',
} as const;

/**
 * Upload un fichier vers Supabase Storage.
 * Retourne l'URL publique du fichier.
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer | Blob,
  contentType: string
): Promise<string> {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload error: ${error.message}`);
  }

  return getPublicUrl(bucket, path);
}

/**
 * Upload une image en base64 vers Supabase Storage.
 * Retourne l'URL publique.
 */
export async function uploadBase64Image(
  base64Data: string,
  mimeType: string,
  path: string
): Promise<string> {
  const buffer = Buffer.from(base64Data, 'base64');
  return uploadFile('roomvision', path, buffer, mimeType);
}

/**
 * Retourne l'URL publique d'un fichier dans un bucket.
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Supprime un fichier d'un bucket.
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error(`Storage delete error: ${error.message}`);
  }
}

/**
 * Génère un chemin de stockage standardisé.
 */
export function buildStoragePath(
  userId: string,
  projectId: string,
  type: 'room' | 'moodboard' | 'reference' | 'render',
  filename: string
): string {
  return `${userId}/${projectId}/${type}/${filename}`;
}

/**
 * Génère une URL de téléchargement signée (temporaire, pour l'export HD).
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data) {
    throw new Error(`Signed URL error: ${error?.message}`);
  }

  return data.signedUrl;
}
