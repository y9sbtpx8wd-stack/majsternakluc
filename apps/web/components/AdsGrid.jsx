'use client';

import { Listing } from '@/lib/types';

export default function AdsGrid({
  ads,
  setSelectedAd,
  setChatAd,
}: {
  ads: Listing[];
  setSelectedAd: (ad: Listing) => void;
  setChatAd: (ad: Listing) => void;
}) {
  return (
    <div className="grid">
      {ads.map((ad) => (
        <div key={ad.id} className="card round" style={{ padding: 16 }}>
          {/* Avatar + meno + lokalita */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: '#eee',
                backgroundImage: ad.avatar ? `url(${ad.avatar})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>
                {ad.firstName} {ad.lastName}
              </div>
              <div className="muted">{ad.location}</div>
            </div>
          </div>

          {/* Intro */}
          <p style={{ marginTop: 12 }}>
            {ad.intro?.slice(0, 120) ?? ad.description.slice(0, 120)}...
          </p>

          {/* Fotky */}
          {ad.photos && ad.photos.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {ad.photos.slice(0, 3).map((p, i) => (
                <div
                  key={i}
                  className="round"
                  style={{
                    width: 80,
                    height: 80,
                    background: '#eee',
                    backgroundImage: `url(${p})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              ))}
            </div>
          )}

          {/* Tlačidlá */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="button" onClick={() => setSelectedAd(ad)}>
              Zobraziť
            </button>
            <button
              className="button"
              style={{ background: '#4CAF50' }}
              onClick={() => setChatAd(ad)}
            >
              Chat
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

