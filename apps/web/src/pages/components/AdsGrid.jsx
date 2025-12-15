<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '16px'
}}>
  {ads.map((ad) => (
    <div
      key={ad.id}
      style={{
        border: '1px solid #ddd',
        padding: '16px',
        borderRadius: '8px',
        cursor: 'pointer',
        background: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}
      onClick={() => setSelectedAd(ad)}
    >
      <h3>{ad.title}</h3>
      <p>{ad.profession}, {ad.location}</p>
      <p>Cena: {ad.price} €</p>
    </div>
  ))}
</div>
