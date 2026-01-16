'use client';

import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: 'info' | 'error' | 'warning' }[]
  >([]);

  const show = useCallback((message: string, type: 'info' | 'error' | 'warning' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return { toasts, show };
}
