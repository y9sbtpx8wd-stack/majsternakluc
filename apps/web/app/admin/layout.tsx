'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/lib/useRole';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { role, user, loading, isAdmin, isSuperAdmin } = useRole();
  const pathname = usePathname();

  // 🔥 Dark / Light mode
  const [theme, setTheme] = useState<'light' | 'dark'>('light');


  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // 🔥 Loading
  if (loading) return <p>Načítavam...</p>;

  // 🔥 Access control
  if (!isAdmin && !isSuperAdmin) {
    return <p>Nemáte prístup.</p>;
  }

  useEffect(() => { const saved = localStorage.getItem('theme'); 
    if (saved === 'dark' || saved === 'light') { setTheme(saved); } }, []); 

  useEffect(() => { localStorage.setItem('theme', theme); 
    document.documentElement.dataset.theme = theme; }, [theme]);
    
  // 🔥 Active link styling
  const linkStyle = (href: string) => ({
    padding: '8px 12px',
    borderRadius: 6,
    textDecoration: 'none',
    color: pathname === href ? '#fff' : '#333',
    background: pathname === href ? '#1976D2' : 'transparent',
    display: 'block',
    fontSize: 14,
  });

  // 🔥 Logout handler
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: 240,
          borderRight: '1px solid rgba(0,0,0,0.08)',
          padding: 16,
          background: 'var(--card-bg, #f7f7f7)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* TOP SECTION */}
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Admin</h2>

          {/* 🔥 Zobrazenie mena admina */}
          {user && (
            <div
              style={{
                marginBottom: 20,
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.05)',
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              <strong>{user.firstName} {user.lastName}</strong>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{user.role}</div>
            </div>
          )}

          {/* 🔥 Sidebar menu */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link href="/admin/dashboard" style={linkStyle('/admin/dashboard')}>
              Dashboard
            </Link>

            {/* SUPERADMIN ONLY */}
            {isSuperAdmin && (
              <>
                <Link href="/admin/users" style={linkStyle('/admin/users')}>
                  Používatelia
                </Link>

                <Link href="/admin/logs" style={linkStyle('/admin/logs')}>
                  Logy
                </Link>
              </>
            )}

            {/* ADMIN + SUPERADMIN */}
            <Link href="/admin/invoice" style={linkStyle('/admin/invoice')}>
              Faktúry
            </Link>
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* 🔥 Dark / Light mode toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid rgba(0,0,0,0.15)',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>

          {/* 🔥 Logout button */}
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid rgba(0,0,0,0.15)',
              background: '#E53935',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Odhlásiť sa
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
    </div>
  );
}
