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

  const [error, setError] = useState('');

  const submit = async () => {
    // VALIDÁCIA
    if (!form.firstName.trim()) {
      setError('Meno je povinné.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Telefón je povinný.');
      return;
    }
    if (!form.content.trim()) {
      setError('Obsah dopytu je povinný.');
      return;
    }
    if (!form.location.trim()) {
      setError('Lokalita je povinná.');
      return;
    }

    setError('');

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

        {/* ERROR MESSAGE */}
        {error && (
          <div
            style={{
              background: '#ffe5e5',
              color: '#b30000',
              padding: '10px 12px',
              borderRadius: 12,
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {/* MENO */}
        <div className="modal-section">
          <input
            placeholder="Meno *"
            className="round"
            style={{ width: '100%', padding: 8 }}
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>

        {/* PRIEZVISKO */}
        <div className="modal-section">
          <input
            placeholder="Priezvisko"
            className="round"
            style={{ width: '100%', padding: 8 }}
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        {/* TELEFÓN */}
        <div className="modal-section">
          <input
            placeholder="Telefón *"
            className="round"
            style={{ width: '100%', padding: 8 }}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        {/* EMAIL */}
        <div className="modal-section">
          <input
            placeholder="Email"
            className="round"
            style={{ width: '100%', padding: 8 }}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* OBSAH DOPYTU */}
        <div className="modal-section">
          <textarea
            placeholder="Obsah dopytu *"
            className="round"
            style={{ width: '100%', padding: 8, minHeight: 120 }}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        {/* LOKALITA */}
        <div className="modal-section">
          <input
            placeholder="Lokalita *"
            className="round"
            style={{ width: '100%', padding: 8 }}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        {/* CENA */}
        <div className="modal-section">
          <input
            placeholder="Ponúkaná cena"
            className="round"
            style={{ width: '100%', padding: 8 }}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        {/* SUBMIT */}
        <button className="button" onClick={submit}>
          Odoslať dopyt
        </button>
      </div>
    </div>
  );
}
