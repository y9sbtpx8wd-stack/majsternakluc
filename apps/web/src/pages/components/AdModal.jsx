export default function AdModal({ ad, onClose }) {
  if (!ad) return null;

  const maskEmail = (email) => {
    if (!email) return '—';
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    return `${local.slice(0, 4)}........@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '—';
    const digits = phone.replace(/\s+/g, '');
    return `${digits.slice(0, 4)}.......`;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {/* Názov / meno */}
        <h2 className="modal-title">{ad.title}</h2>

        {/* Fotky */}
        <section className="modal-section">
          <h3>Fotky</h3>
          <div className="modal-photos">
            {(ad.photos ?? []).slice(0, 3).map((src, i) => (
              <div
                key={i}
                className="modal-photo"
                style={{
                  backgroundImage: src ? `url(${src})` : undefined,
                }}
              />
            ))}
            {(!ad.photos || ad.photos.length === 0) && (
              <p className="muted">Žiadne fotky zatiaľ nie sú k dispozícii.</p>
            )}
          </div>
        </section>

        {/* Osobné údaje */}
        <section className="modal-section">
          <h3>Osobné údaje</h3>
          <p><strong>Meno:</strong> {ad.title}</p>
          <p><strong>Lokalita:</strong> {ad.location ?? 'neuvedené'}</p>
          {ad.experienceYears && (
            <p><strong>Prax:</strong> {ad.experienceYears} rokov</p>
          )}
        </section>

        {/* Predstavenie */}
        <section className="modal-section">
          <h3>Predstavenie</h3>
          <p>{ad.description}</p>
        </section>

        {/* Zručnosti */}
        <section className="modal-section">
          <h3>Zručnosti</h3>
          {ad.skills && ad.skills.length > 0 ? (
            <ul className="modal-list">
              {ad.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Zručnosti zatiaľ nie sú vyplnené.</p>
          )}
        </section>

        {/* Cenník */}
        <section className="modal-section">
          <h3>Cenník</h3>
          {ad.priceList && ad.priceList.length > 0 ? (
            <ul className="modal-list">
              {ad.priceList.map((item) => (
                <li key={item.service}>
                  {item.service}: {item.price}
                </li>
              ))}
            </ul>
          ) : ad.pricePerHour ? (
            <p>Orientačná cena: {ad.pricePerHour} €/h</p>
          ) : (
            <p className="muted">Cenník zatiaľ nie je vyplnený.</p>
          )}
        </section>

        {/* Doplnkové informácie */}
        <section className="modal-section">
          <h3>Doplnkové informácie</h3>
          {ad.extraInfo ? (
            <p>{ad.extraInfo}</p>
          ) : (
            <p className="muted">Žiadne doplnkové informácie.</p>
          )}
        </section>

        {/* Kontakt */}
        <section className="modal-section">
          <h3>Kontakt</h3>
          <p>
            <strong>Telefón:</strong>{' '}
            {ad.showPhone ? ad.phone ?? 'neuvedené' : maskPhone(ad.phone)}
          </p>
          <p>
            <strong>Email:</strong>{' '}
            {ad.showEmail ? ad.email ?? 'neuvedené' : maskEmail(ad.email)}
          </p>
        </section>
      </div>
    </div>
  );
}
