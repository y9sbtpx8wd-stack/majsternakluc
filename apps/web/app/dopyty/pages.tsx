'use client';

import { useEffect, useState } from 'react';
import DemandModal from '@/components/DemandModal';

export default function DopytyPage() {
  const [dopyty, setDopyty] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dopyty`)
      .then((res) => res.json())
      .then(setDopyty);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dopyty</h1>

      <button className="button" onClick={() => setModal(true)}>
        Zadať dopyt
      </button>

      <div className="grid" style={{ marginTop: 20 }}>
        {dopyty.map((d: any) => (
          <div
            key={d.id}
            className="card round"
            style={{ padding: 16 }}
            onClick={() => setSelected(d)}
          >
            <h3>{d.firstName} {d.lastName}</h3>
            <p className="muted">{d.location}</p>
            <p>{d.content.slice(0, 100)}...</p>
          </div>
        ))}
      </div>

      {modal && <DemandModal onClose={() => setModal(false)} />}
    </div>
  );
}
