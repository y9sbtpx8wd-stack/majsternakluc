'use client';

import { useEffect, useState } from 'react';

export function useRole() {
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/user');
        const data = await res.json();

        if (!data || !data.role) {
          setRole(null);
          setUser(null);
        } else {
          setRole(data.role);
          setUser(data);
        }
      } catch (e) {
        setRole(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return {
    role,      // 'USER' | 'ADMIN' | 'SUPERADMIN' | null
    user,      // celý user objekt
    loading,   // načítava sa?
    isUser: role === 'USER',
    isAdmin: role === 'ADMIN',
    isSuperAdmin: role === 'SUPERADMIN',
    hasRole: (r: string) => role === r,
    hasAnyRole: (roles: string[]) => roles.includes(role ?? ''),
  };
}
