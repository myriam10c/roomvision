export const dynamic = "force-dynamic"
// ============================================================
// GET    /api/favorites — Liste des favoris
// POST   /api/favorites — Ajouter un favori
// DELETE /api/favorites?generationId=xxx — Retirer un favori
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServer } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        generation: {
          include: {
            variants: true,
            room: { select: { id: true, name: true, photoUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('GET /api/favorites error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { generationId } = await req.json();
    if (!generationId) {
      return NextResponse.json({ error: 'generationId is required' }, { status: 400 });
    }

    // Vérifier que la génération existe et appartient à l'utilisateur
    const generation = await prisma.generation.findFirst({
      where: { id: generationId, userId: user.id },
    });
    if (!generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
    }

    // Eviter les doublons
    const existing = await prisma.favorite.findFirst({
      where: { userId: user.id, generationId },
    });
    if (existing) {
      return NextResponse.json(existing);
    }

    const favorite = await prisma.favorite.create({
      data: { userId: user.id, generationId },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error('POST /api/favorites error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const generationId = req.nextUrl.searchParams.get('generationId');
    if (!generationId) {
      return NextResponse.json({ error: 'generationId is required' }, { status: 400 });
    }

    const favorite = await prisma.favorite.findFirst({
      where: { userId: user.id, generationId },
    });
    if (favorite) {
      await prisma.favorite.delete({ where: { id: favorite.id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/favorites error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
