'use client';

import { useRole } from '@/lib/useRole';

export function RequireRole({ role, children }) {
  const { role: userRole, loading } = useRole();

  if (loading) return null;
  if (userRole !== role) return null;

  return children;
}
