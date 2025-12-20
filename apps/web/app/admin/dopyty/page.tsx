'use client';

import { useEffect, useState } from 'react';
import DemandModal from '@/components/DemandModal';
import DemandDetailModal from '@/components/DemandDetailModal';

export default function AdminDopytyPage() {
  const [dopyty, setDopyty] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [modal, setModal] = useState(false);

  // Admin štatistiky
  const [stats, setStats] = useState<any>(null);

  // Filtre
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');

  const fetchDopyty = async () => {
    const params = new URLSearchParams();
    if (service) params.append('service', service);
    if (location) params.append('location', location);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/dopyty/stats?${params.toString()}`
    );

    const data = await res.json();

    setStats(data.stats);
    setDopyty(data.items);
  };

  useEffect(() => {
    fetchDopyty();
  }, []);

  // Moderovanie
  const hideDemand = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dopyty/${id}/hide`, {
      method: 'PATCH',
    });
    fetchDopyty();
  };

  const resolveDemand = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dopyty/${id}/resolve`, {
      method: 'PATCH',
    });
    fetchDopyty();
  };

  const markSpam = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dopyty/${id}/spam`, {
      method: 'PATCH',
    });
    fetchDopyty();
  };

  const banUser = async (userId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/ban`, {
      method: 'PATCH',
    });
    fetchDopyty();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin – Dopyty</h1>

      {/* FILTRE */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          placeholder="Služba"
          className="round"
          style={{ padding: 8 }}
          value={service}
          onChange={(e) => setService(e.target.value)}
        />

        <input
          placeholder="Lokalita"
          className="round"
          style={{ padding: 8 }}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button className="button" onClick={fetchDopyty}>
          Filtrovať
        </button>
      </div>

      {/* ŠTATISTIKY */}
      {stats && (
        <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
          <h3>Prehľad</h3>
          <p>Počet dopytov: {stats.total}</p>
          <p>Počet zobrazení: {stats.totalViews}</p>
          <p>Počet odpovedí: {stats.totalReplies}</p>
        </div>
      )}

      {/* GRID DOPYTOV */}
      <div className="grid" style={{ marginTop: 20 }}>
        {dopyty.map((d: any) => (
          <div
            key={d.id}
            className="card round"
            style={{ padding: 16, cursor: 'pointer' }}
            onClick={() => setSelected(d)}
          >
            <h3>
              {d.firstName} {d.lastName}
            </h3>
            <p className="muted">{d.location}</p>
            <p>{d.content.slice(0, 100)}...</p>

            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.7 }}>
              Zobrazenia: {d.views ?? 0}
            </div>

            <div style={{ marginTop: 4, fontSize: 13, opacity: 0.7 }}>
              Odpovede: {d.replies ?? 0}
            </div>

            {/* ADMIN TLAČIDLÁ */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                className="button"
                style={{ background: '#999' }}
                onClick={(e) => {
                  e.stopPropagation();
                  hideDemand(d.id);
                }}
              >
                Skryť
              </button>

              <button
                className="button"
                style={{ background: '#4CAF50' }}
                onClick={(e) => {
                  e.stopPropagation();
                  resolveDemand(d.id);
                }}
              >
                Vyriešené
              </button>

              <button
                className="button"
                style={{ background: '#e67e22' }}
                onClick={(e) => {
                  e.stopPropagation();
                  markSpam(d.id);
                }}
              >
                Spam
              </button>

              <button
                className="button"
                style={{ background: '#e53935' }}
                onClick={(e) => {
                  e.stopPropagation();
                  banUser(d.userId);
                }}
              >
                Ban
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL NA VYTVORENIE DOPYTU */}
      {modal && <DemandModal onClose={() => setModal(false)} />}

      {/* DETAIL DOPYTU */}
      {selected && (
        <DemandDetailModal demand={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

