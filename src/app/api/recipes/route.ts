export const dynamic = "force-dynamic"
// ============================================================
// GET  /api/recipes — Liste des recettes de l'utilisateur
// POST /api/recipes — Créer une nouvelle recette
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServer } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const includePublic = req.nextUrl.searchParams.get('includePublic') === 'true';

    const recipes = await prisma.recipe.findMany({
      where: includePublic
        ? { OR: [{ userId: user.id }, { isPublic: true }] }
        : { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('GET /api/recipes error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      name,
      description,
      prompt,
      style,
      roomType,
      intensity = 'MEDIUM',
      transformationType = 'FAITHFUL',
      referenceUrls = [],
      thumbnailUrl,
      isPublic = false,
    } = body;

    if (!name || !prompt) {
      return NextResponse.json(
        { error: 'name and prompt are required' },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.create({
      data: {
        name,
        description: description || null,
        prompt,
        style: style || null,
        roomType: roomType || null,
        intensity,
        transformationType,
        referenceUrls,
        thumbnailUrl: thumbnailUrl || null,
        isPublic,
        userId: user.id,
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('POST /api/recipes error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
