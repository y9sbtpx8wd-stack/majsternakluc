'use client';

import { useState } from 'react';

export default function DemandModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    content: '',
    location: '',
    price: '',
  });

  const submit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dopyty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">Zadať dopyt</h2>

        <div className="modal-section">
          <input
            placeholder="Meno *"
            className="round"
            style={{ width: '100%', padding: 8 }}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>

        <div className="modal-section">
          <input
            placeholder="Priezvisko"
            className="round"
            style={{ width: '100%', padding: 8 }}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        <div className="modal-section">
          <input
            placeholder="Telefón *"
            className="round"
            style={{ width: '100%', padding: 8 }}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="modal-section">
          <input
            placeholder="Email"
            className="round"
            style={{ width: '100%', padding: 8 }}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="modal-section">
          <textarea
            placeholder="Obsah dopytu *"
            className="round"
            style={{ width: '100%', padding: 8, minHeight: 120 }}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div className="modal-section">
          <input
            placeholder="Lokalita *"
            className="round"
            style={{ width: '100%', padding: 8 }}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <div className="modal-section">
          <input
            placeholder="Ponúkaná cena"
            className="round"
            style={{ width: '100%', padding: 8 }}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        <button className="button" onClick={submit}>
          Odoslať dopyt
        </button>
      </div>
    </div>
  );
}
