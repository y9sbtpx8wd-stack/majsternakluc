import React from 'react';
import { AdCard } from './AdCard';

export default function AdsGrid({ ads, setSelectedAd, setChatAd }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        padding: '20px 0',
      }}
    >
      {ads.map((ad) => (
        <div
          key={ad.id}
          style={{
            border: '1px solid #ddd',
            padding: '20px',
            borderRadius: '20px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Názov + lokalita */}
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0, color: '#333' }}>{ad.title}</h3>
            <p style={{ margin: '4px 0', color: '#666' }}>
              {ad.profession ?? '—'}, {ad.location ?? '—'}
            </p>
          </div>

          {/* Popis */}
          <p style={{ color: '#555', fontSize: 14, marginBottom: 12 }}>
            {ad.description?.length > 120
              ? ad.description.slice(0, 120) + '…'
              : ad.description}
          </p>

          {/* Fotky */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {(ad.photos ?? []).slice(0, 3).map((p, i) => (
              <div
                key={i}
                className="round"
                style={{
                  width: 60,
                  height: 60,
                  background: p ? `url(${p})` : '#f2f2f2',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px',
                }}
              />
            ))}
          </div>

          {/* Cena */}
          <p style={{ fontWeight: 600, marginBottom: 16 }}>
            Cena: {ad.pricePerHour ?? ad.price ?? '—'} €
          </p>

          {/* Tlačidlá */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="button"
              style={{
                flex: 1,
                background: '#6464C7',
                color: 'white',
                borderRadius: '20px',
              }}
              onClick={() => setSelectedAd(ad)}
            >
              Zobraziť inzerát
            </button>

            <button
              className="button"
              style={{
                flex: 1,
                background: '#4CAF50',
                color: 'white',
                borderRadius: '20px',
              }}
              onClick={() => setChatAd(ad)}
            >
              Začať chat
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

