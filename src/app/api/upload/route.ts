export const dynamic = "force-dynamic"
// ============================================================
// POST /api/upload — Upload d'images vers Supabase Storage
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { uploadFile, BUCKETS, buildStoragePath } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string; // 'room' | 'moodboard' | 'reference'
    const projectId = formData.get('projectId') as string;

    if (!file || !type || !projectId) {
      return NextResponse.json(
        { error: 'file, type, and projectId are required' },
        { status: 400 }
      );
    }

    // Validation du fichier
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large (max 10MB)' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Accepted: JPEG, PNG, WebP, HEIC' },
        { status: 400 }
      );
    }

    // Déterminer le bucket
    const bucket = type === 'room' ? BUCKETS.ROOM_PHOTOS : BUCKETS.MOODBOARDS;

    // Générer un nom de fichier unique
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = buildStoragePath(user.id, projectId, type as 'room' | 'moodboard' | 'reference', filename);

    // Convertir le File en Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload
    const publicUrl = await uploadFile(bucket, path, buffer, file.type);

    return NextResponse.json({
      url: publicUrl,
      path,
      bucket,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // FormData
  },
};
