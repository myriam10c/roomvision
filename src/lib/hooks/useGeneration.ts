'use client';

// ============================================================
// useGeneration — Hook pour suivre le statut d'une génération
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { Generation } from '@/types';

interface UseGenerationOptions {
  pollInterval?: number; // ms, default 3000
  autoStop?: boolean;    // Stop polling when completed/failed
}

export function useGeneration(
  generationId: string | null,
  options: UseGenerationOptions = {}
) {
  const { pollInterval = 3000, autoStop = true } = options;

  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGeneration = useCallback(async () => {
    if (!generationId) return null;
    try {
      const res = await fetch(`/api/generations/${generationId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setGeneration(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      return null;
    }
  }, [generationId]);

  useEffect(() => {
    if (!generationId) return;

    setLoading(true);
    fetchGeneration().finally(() => setLoading(false));

    const interval = setInterval(async () => {
      const data = await fetchGeneration();
      if (autoStop && data && (data.status === 'COMPLETED' || data.status === 'FAILED')) {
        clearInterval(interval);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [generationId, pollInterval, autoStop, fetchGeneration]);

  return {
    generation,
    loading,
    error,
    isProcessing: generation?.status === 'PENDING' || generation?.status === 'PROCESSING',
    isCompleted: generation?.status === 'COMPLETED',
    isFailed: generation?.status === 'FAILED',
    refetch: fetchGeneration,
  };
}
