'use client';

// ============================================================
// Page Recettes — Liste et gestion des recettes de génération
// ============================================================

import { useEffect, useState } from 'react';
import { BookOpen, Plus, Trash2, Globe, Lock } from 'lucide-react';
import type { Recipe } from '@/types';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPublic, setShowPublic] = useState(false);

  const fetchRecipes = () => {
    setLoading(true);
    fetch(`/api/recipes?includePublic=${showPublic}`)
      .then((res) => res.json())
      .then(setRecipes)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecipes();
  }, [showPublic]);

  const deleteRecipe = async (id: string) => {
    if (!confirm('Supprimer cette recette ?')) return;
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            Mes Recettes
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Sauvegardez et réutilisez vos configurations de génération préférées
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPublic(!showPublic)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              showPublic
                ? 'bg-amber-600/20 border border-amber-500/30 text-amber-300'
                : 'bg-neutral-800 border border-neutral-700 text-neutral-400'
            }`}
          >
            <Globe className="w-3.5 h-3.5 inline mr-1" />
            Publiques
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <BookOpen className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">
            Aucune recette. Créez-en une depuis la page de résultats.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all group"
            >
              {/* Thumbnail */}
              {recipe.thumbnailUrl && (
                <div className="aspect-video rounded-lg overflow-hidden bg-neutral-800 mb-4">
                  <img src={recipe.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-200">{recipe.name}</h3>
                  {recipe.description && (
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{recipe.description}</p>
                  )}
                </div>
                {recipe.isPublic ? (
                  <Globe className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {recipe.style && (
                  <span className="text-[10px] px-2 py-0.5 bg-neutral-800 rounded text-neutral-400">
                    {recipe.style}
                  </span>
                )}
                {recipe.roomType && (
                  <span className="text-[10px] px-2 py-0.5 bg-neutral-800 rounded text-neutral-400">
                    {recipe.roomType}
                  </span>
                )}
                <span className="text-[10px] px-2 py-0.5 bg-neutral-800 rounded text-neutral-400">
                  {recipe.intensity}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-neutral-800 rounded text-neutral-400">
                  {recipe.transformationType === 'FAITHFUL' ? 'Fidèle' : 'Créatif'}
                </span>
              </div>

              {/* Prompt preview */}
              {recipe.prompt && (
                <p className="text-xs text-neutral-600 mt-3 line-clamp-2 italic">
                  "{recipe.prompt}"
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-800">
                <span className="text-[10px] text-neutral-600">
                  {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}
                </span>
                <button
                  onClick={() => deleteRecipe(recipe.id)}
                  className="p-1.5 rounded hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
