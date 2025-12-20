'use client';

import { useEffect, useState } from 'react';
import AdsGrid from '@/components/AdsGrid';
import AdModal from '@/components/AdModal';
import ChatWidget from '@/components/ChatWidget';
import Menu from '@/components/Menu';
import { Listing } from '@/lib/types';

export default function HomePage() {
  const [ads, setAds] = useState<Listing[]>([]);
  const [selectedAd, setSelectedAd] = useState<Listing | null>(null);
  const [chatAd, setChatAd] = useState<Listing | null>(null);

  // Fulltext
  const [search, setSearch] = useState('');

  // Filters (bočný panel)
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');

  const fetchAds = async () => {
    const params = new URLSearchParams();

    if (search) params.append('search', search);
    if (profession) params.append('profession', profession);
    if (location) params.append('location', location);
    if (minRating) params.append('minRating', minRating);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings?${params.toString()}`
    );

    const data = await res.json();
    setAds(data);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      {/* -------------------------------- */}
      {/* BOČNÝ PANEL – FILTRE */}
      {/* -------------------------------- */}
      <aside
        style={{
          width: 260,
          padding: 20,
          borderRight: '1px solid #eee',
          position: 'sticky',
          top: 0,
          height: '100vh',
          background: '#fff',
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Filtre</h3>

        <input
          placeholder="Profesia"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="round"
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />

        <input
          placeholder="Lokalita"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="round"
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />

        <input
          type="number"
          min={1}
          max={5}
          placeholder="Min. hodnotenie"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="round"
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />

        <button onClick={fetchAds} className="button" style={{ width: '100%' }}>
          Filtrovať
        </button>

        <hr style={{ margin: '20px 0' }} />

        <h3>Kategórie</h3>
        <ul style={{ paddingLeft: 16 }}>
          <li>Murári</li>
          <li>Elektrikári</li>
          <li>Obkladači</li>
          <li>Maliari</li>
          <li>Stavbári</li>
        </ul>

        <hr style={{ margin: '20px 0' }} />

        <h3>Najnovšie články</h3>
        <ul style={{ paddingLeft: 16 }}>
          <li>5 tipov ako vybrať majstra</li>
          <li>Koľko stojí rekonštrukcia bytu</li>
          <li>Najčastejšie chyby pri stavbe domu</li>
        </ul>
      </aside>

      {/* -------------------------------- */}
      {/* HLAVNÝ OBSAH */}
      {/* -------------------------------- */}
      <main style={{ flex: 1, padding: 20 }}>
        {/* MENU */}
        <Menu />

        {/* FULLTEXT */}
        <div style={{ marginBottom: 20 }}>
          <input
            placeholder="Vyhľadávanie v inzerátoch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="round"
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ccc',
              borderRadius: 12,
            }}
          />
          <button
            onClick={fetchAds}
            className="button"
            style={{ marginTop: 8 }}
          >
            Hľadať
          </button>
        </div>

        {/* GRID INZERÁTOV */}
        <AdsGrid
          ads={ads}
          setSelectedAd={setSelectedAd}
          setChatAd={setChatAd}
        />

        {/* MODAL DETAIL */}
        {selectedAd && (
          <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
        )}

        {/* CHAT */}
        {chatAd && <ChatWidget ad={chatAd} onClose={() => setChatAd(null)} />}
      </main>
    </div>
  );
}

