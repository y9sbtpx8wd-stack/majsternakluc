import { useEffect, useState } from "react";
import AdsGrid from "./components/AdsGrid";
import AdModal from "./components/AdModal";



export default function AdsPage() {
  const [ads, setAds] = useState([]);
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [selectedAd, setSelectedAd] = useState(null);

  const fetchAds = async () => {
    const params = new URLSearchParams();
    if (profession) params.append("profession", profession);
    if (location) params.append("location", location);
    if (minRating) params.append("minRating", minRating);

    const res = await fetch(`/api/inzeraty?${params.toString()}`);
    const data = await res.json();
    setAds(data);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <h1>Majster na kľúč</h1>
      <p>Filtrovanie inzerátov podľa profesie, lokality a hodnotení.</p>

      {/* Filter */}
      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
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

      {/* Grid s inzerátmi */}
      <AdsGrid ads={ads} onSelect={setSelectedAd} />

      {/* Modal na detail */}
      <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
    </main>
  );
}
