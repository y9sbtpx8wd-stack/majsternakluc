'use client';

import { useEffect, useState } from 'react';
import AdsGrid from '../../../components/AdsGrid';
import AdModal from '../../../components/AdModal';

export default function AdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');
  const [selectedAd, setSelectedAd] = useState<any | null>(null);

  const fetchAds = async () => {
    const params = new URLSearchParams();
    if (profession) params.append('profession', profession);
    if (location) params.append('location', location);
    if (minRating) params.append('minRating', minRating);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inzeraty?${params.toString()}`,
    );
    const data = await res.json();
    setAds(data);
  };

  useEffect(() => {
    fetchAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Majster na kľúč</h1>
      <p style={{ marginBottom: 16 }}>
        Filtrovanie inzerátov podľa profesie, lokality a hodnotení.
      </p>

      <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Profesia (napr. murár)"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />
        <input
          placeholder="Lokalita (napr. Bratislava)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="number"
          min={1}
          max={5}
          placeholder="Minimálne hodnotenie (1-5)"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
        <button onClick={fetchAds} className="button">
          Filtrovať
        </button>
      </div>

      <AdsGrid ads={ads} onSelect={setSelectedAd} />
      <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
    </main>
  );
}
