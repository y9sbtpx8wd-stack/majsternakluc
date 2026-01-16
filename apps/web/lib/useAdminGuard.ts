'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminGuard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/user');
        const data = await res.json();

        if (!data || !data.role) {
          router.replace('/login');
          return;
        }

        if (data.role !== 'ADMIN' && data.role !== 'SUPERADMIN') {
          router.replace('/');
          return;
        }

        setUser(data);
      } catch (e) {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [router]);

  return { loading, user };
}
