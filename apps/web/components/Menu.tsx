'use client';

export default function Menu() {
  return (
    <header className="header">
      {/* Vľavo */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <a href="/" style={{ fontWeight: 600 }}>
          <img src="/favicon.ico" width={24} />
        </a>
        <a href="/o-stranke">O stránke</a>
        <a href="/info">Užitočné info</a>
      </div>

      {/* Stred */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="button">Zadať dopyt</button>
        <a href="/dopyty">Aktuálne dopyty</a>
        <input
          placeholder="Hľadať v inzerátoch..."
          className="round"
          style={{ padding: 8, border: '1px solid #ddd' }}
        />
      </div>

      {/* Vpravo */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="button">+ Pridať inzerát</button>
        <a href="/login">Prihlásiť sa</a>
        <a href="/register">Registrovať</a>
      </div>
    </header>
  );
}
