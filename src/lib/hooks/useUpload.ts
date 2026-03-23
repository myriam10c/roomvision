'use client';

// ============================================================
// useUpload — Hook pour uploader des fichiers vers Supabase
// ============================================================

import { useState, useCallback } from 'react';

interface UploadResult {
  url: string;
  path: string;
  filename: string;
  size: number;
}

interface UseUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function useUpload(options: UseUploadOptions = {}) {
  const {
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      file: File,
      type: 'room' | 'moodboard' | 'reference',
      projectId: string
    ): Promise<UploadResult | null> => {
      setError(null);

      // Validation
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Fichier trop lourd (max ${maxSizeMB}MB)`);
        return null;
      }
      if (!allowedTypes.includes(file.type)) {
        setError('Type de fichier non accepté');
        return null;
      }

      setUploading(true);
      setProgress(10);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('projectId', projectId);

        setProgress(30);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        setProgress(80);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Upload failed');
        }

        const data = await res.json();
        setProgress(100);

        return {
          url: data.url,
          path: data.path,
          filename: data.filename,
          size: data.size,
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        return null;
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 500);
      }
    },
    [maxSizeMB, allowedTypes]
  );

  const uploadMultiple = useCallback(
    async (
      files: File[],
      type: 'room' | 'moodboard' | 'reference',
      projectId: string
    ): Promise<UploadResult[]> => {
      const results: UploadResult[] = [];
      for (const file of files) {
        const result = await upload(file, type, projectId);
        if (result) results.push(result);
      }
      return results;
    },
    [upload]
  );

  return {
    upload,
    uploadMultiple,
    uploading,
    progress,
    error,
    clearError: () => setError(null),
  };
}
