'use client';

import { useEffect } from 'react';
import { useRole } from '@/lib/useRole';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { role, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (role === 'ADMIN' || role === 'SUPERADMIN')) {
      router.replace('/admin/dashboard');
    }
  }, [loading, role, router]);

  return <LoginForm />;
}
