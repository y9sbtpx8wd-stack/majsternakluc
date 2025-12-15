import { useEffect, useState } from 'react';

export default function Home() {
  const [ads, setAds] = useState([]);
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');

  const fetchAds = async () => {
    const params = new URLSearchParams();
    if (profession) params.append('profession', profession);
    if (location) params.append('location', location);
    if (minRating) params.append('minRating', minRating);

    const res = await fetch(`/api/inzeraty?${params.toString()}`);
    const data = await res.json();
    setAds(data);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
      <h1>Majster na kľúč</h1>
      <p>Filtrovanie inzerátov podľa profesie, lokality a hodnotení.</p>

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
          min="1"
          max="5"
          placeholder="Minimálne hodnotenie (1-5)"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
        <button onClick={fetchAds}>Filtrovať</button>
      </div>

      <ul>
        {ads.map((ad) => (
          <li key={ad.id} style={{ marginBottom: 12 }}>
            <strong>{ad.title}</strong> — {ad.profession}, {ad.location}
            <div>{ad.description}</div>
            <div>
              Hodnotenia: {ad.reviews?.length || 0}{' '}
              {ad.reviews && ad.reviews.length > 0
                ? `(priemer: ${
                    (
                      ad.reviews.reduce((sum, r) => sum + r.rating, 0) /
                      ad.reviews.length
                    ).toFixed(1)
                  })`
                : ''}
            </div>
            <div>Remeselník: {ad.user?.name}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
