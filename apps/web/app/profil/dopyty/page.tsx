'use client';

import { useEffect, useState } from 'react';

export default function ProfilDopytyPage() {
  const [dopyty, setDopyty] = useState<any[]>([]);

  const fetchMyDopyty = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dopyty/my`,
      { credentials: 'include' }
    );
    const data = await res.json();
    setDopyty(data);
  };

  const deleteDemand = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dopyty/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchMyDopyty();
  };

  useEffect(() => {
    fetchMyDopyty();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Moje dopyty</h1>

      <div className="grid" style={{ marginTop: 20 }}>
        {dopyty.map((d) => (
          <div key={d.id} className="card round" style={{ padding: 16 }}>
            <h3>{d.content.slice(0, 40)}...</h3>
            <p className="muted">{d.location}</p>
            <p>Zobrazenia: {d.views}</p>

            <button
              className="button"
              style={{ background: '#e53935', marginTop: 10 }}
              onClick={() => deleteDemand(d.id)}
            >
              Vymazať
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
