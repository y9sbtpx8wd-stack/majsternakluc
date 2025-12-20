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
    service: '', // 🔥 doplnené
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    // VALIDÁCIA
    if (!form.firstName.trim()) return setError('Meno je povinné.');
    if (!form.phone.trim()) return setError('Telefón je povinný.');
    if (!form.content.trim()) return setError('Obsah dopytu je povinný.');
    if (!form.location.trim()) return setError('Lokalita je povinná.');
    if (!form.service.trim()) return setError('Služba je povinná.');

    if (form.email && !form.email.includes('@')) {
      return setError('Email nie je v správnom formáte.');
    }

    setError('');
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dopyty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    });

    setLoading(false);

    if (!res.ok) {
      setError('Nepodarilo sa odoslať dopyt.');
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">Zadať dopyt</h2>

        {/* SUCCESS BOX */}
        {success && (
          <div
            style={{
              background: '#e6ffe6',
              color: '#0a7a0a',
              padding: '10px 12px',
              borderRadius: 12,
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            Dopyt bol úspešne odoslaný.
          </div>
        )}

        {/* ERROR BOX */}
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

        {/* SLUŽBA */}
        <div className="modal-section">
          <select
            className="round"
            style={{ width: '100%', padding: 8 }}
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
          >
            <option value="">Vyberte službu *</option>
            <option value="murár">Murár</option>
            <option value="elektrikár">Elektrikár</option>
            <option value="obkladač">Obkladač</option>
            <option value="maliar">Maliar</option>
            <option value="stavbár">Stavbár</option>
            <option value="iná">Iná služba</option>
          </select>
        </div>

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

        {/* OBSAH */}
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
        <button className="button" onClick={submit} disabled={loading}>
          {loading ? 'Odosielam...' : 'Odoslať dopyt'}
        </button>
      </div>
    </div>
  );
}
