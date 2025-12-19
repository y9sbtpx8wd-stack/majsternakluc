import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdModal from '../src/pages/components/AdModal';
import { ChatWidget } from '../src/pages/components/ChatWidget';
import AdsGrid from '../src/pages/components/AdsGrid';

type PriceItem = {
  service: string;
  price: string;
};

type Listing = {
  id: string;
  title: string;                 // názov inzerátu
  description: string;           // predstavenie / popis
  intro?: string;                // krátke intro (ak existuje)
  pricePerHour?: string;         // fallback cena
  photos?: string[];             // max 3 zobrazíme
  location?: string;             // lokalita pôsobenia
  experienceYears?: number;      // prax v rokoch
  skills?: string[];             // zručnosti
  email?: string;
  phone?: string;
  showEmail?: boolean;
  showPhone?: boolean;
  priceList?: PriceItem[];       // detailný cenník
  extraInfo?: string;            // doplnkové info (referencie, certifikáty)
  isOnline?: boolean;            // dostupnosť online
};

export default function LandingPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedAd, setSelectedAd] = useState<Listing | null>(null);
  const [chatAd, setChatAd] = useState<Listing | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`)
      .then(res => res.json())
      .then(setListings)
      .catch(() => setListings([]));
  }, []);

  return (
    <>
      <Head>
        <title>majsternakluc.sk</title>
      </Head>

      <header className="header">
        <div className="round">majsternakluc</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            className="round"
            placeholder="Hľadať..."
            style={{ padding: 8, border: '1px solid #ddd' }}
          />
          <button className="button">Zadať dopyt</button>
          <button className="button" style={{ background: '#666' }}>Prihlásiť sa</button>
          <button className="button" style={{ background: '#999' }}>Registrovať</button>
        </div>
      </header>

      <main className="page-root">
        <h1>Inzeráty remeselníkov</h1>

        {/* TU JE NOVÝ GRID */}
        <AdsGrid
          ads={listings}
          setSelectedAd={setSelectedAd}
          setChatAd={setChatAd}
        />
      </main>

      {selectedAd && (
        <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
      )}

      {chatAd && (
        <ChatWidget ad={chatAd} onClose={() => setChatAd(null)} />
      )}
    </>
  );
}
