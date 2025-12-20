'use client';

import { useState } from 'react';

export default function InvoiceFilters() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search);
    if (from) params.set('from', from);
    else params.delete('from');

    if (to) params.set('to', to);
    else params.delete('to');

    window.location.search = params.toString();
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="round"
      />
      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="round"
      />
      <button onClick={applyFilters} className="button">
        Filtrovať
      </button>
    </div>
  );
}
