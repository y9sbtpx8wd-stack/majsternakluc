'use client';

import { Listing } from '@/lib/types';

export default function AdModal({
  ad,
  onClose,
}: {
  ad: Listing | null;
  onClose: () => void;
}) {
  if (!ad) return null;

  const maskedEmail = ad.showEmail
    ? ad.email
    : ad.email
    ? ad.email.slice(0, 4) + '*******'
    : 'nezobrazené';

  const maskedPhone = ad.showPhone
    ? ad.phone
    : ad.phone
    ? ad.phone.slice(0, 4) + '*******'
    : 'nezobrazené';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">
          {ad.firstName} {ad.lastName}
        </h2>

        {/* Fotky */}
        {ad.photos && (
          <div className="modal-photos">
            {ad.photos.map((p, i) => (
              <div
                key={i}
                className="modal-photo"
                style={{ backgroundImage: `url(${p})` }}
              />
            ))}
          </div>
        )}

        {/* Sekcie */}
        <div className="modal-section">
          <h3>Predstavenie</h3>
          <p>{ad.description}</p>
        </div>

        <div className="modal-section">
          <h3>Zručnosti</h3>
          <ul className="modal-list">
            {ad.skills?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="modal-section">
          <h3>Lokalita</h3>
          <p>{ad.location}</p>
        </div>

        {ad.priceList && (
          <div className="modal-section">
            <h3>Cenník</h3>
            <ul className="modal-list">
              {ad.priceList.map((p, i) => (
                <li key={i}>
                  {p.service}: {p.price}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-section">
          <h3>Kontakt</h3>
          <p>Email: {maskedEmail}</p>
          <p>Telefón: {maskedPhone}</p>
        </div>

        {ad.extraInfo && (
          <div className="modal-section">
            <h3>Doplnkové informácie</h3>
            <p>{ad.extraInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
