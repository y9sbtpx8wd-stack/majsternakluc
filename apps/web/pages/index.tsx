import { useEffect, useState } from 'react';

type Listing = {
  id: string;
  title: string;
  description: string;
  pricePerHour?: string;
  photos?: string[];
};

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`)
      .then(res => res.json())
      .then(setListings)
      .catch(() => setListings([]));
  }, []);

  return (
    <>
      <header className="header">
        <div className="round">majsternakluc</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input className="round" placeholder="Hľadať..." style={{ padding: 8, border: '1px solid #ddd' }} />
          <button className="button">Zadať dopyt</button>
          <button className="button" style={{ background: '#666' }}>Prihlásiť sa</button>
          <button className="button" style={{ background: '#999' }}>Registrovať</button>
        </div>
      </header>

      <main>
        <div className="grid">
          {listings.map(l => (
            <div className="card" key={l.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><strong>{l.title}</strong></div>
                <div>lokalita: —</div>
              </div>
              <p style={{ color: '#555' }}>{l.description}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {(l.photos ?? []).slice(0,3).map((p, i) => (
                  <div key={i} className="round" style={{ width: 60, height: 60, background: '#f2f2f2' }} />
                ))}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button className="button">Zobraziť inzerát</button>
                <button className="button" style={{ background: '#4CAF50' }}>Začať chat</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
