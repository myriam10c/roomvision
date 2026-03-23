'use client';

// ============================================================
// useCredits — Hook pour afficher les crédits et le plan
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';

export function useCredits() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch {
      console.error('Failed to fetch user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    credits: user?.credits ?? 0,
    plan: user?.plan ?? 'FREE',
    user,
    loading,
    refetch: fetchUser,
    hasCredits: (user?.credits ?? 0) > 0,
    isFreePlan: user?.plan === 'FREE',
  };
}
