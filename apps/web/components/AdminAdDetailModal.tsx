'use client';

import { useEffect, useState } from 'react';
import { Listing } from '@/lib/types';

export default function AdminAdDetailModal({
  ad,
  onClose,
}: {
  ad: Listing | null;
  onClose: () => void;
}) {
  const [stats, setStats] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!ad) return;

    const load = async () => {
      const [statsRes, historyRes, reviewsRes, reportsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/listings/${ad.id}/stats`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/listings/${ad.id}/history`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/listings/${ad.id}/reviews`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/listings/${ad.id}/reports`),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (historyRes.ok) setHistory(await historyRes.json());
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
    };

    load();
  }, [ad]);

  if (!ad) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">
          Admin detail – {ad.firstName} {ad.lastName}
        </h2>

        <div className="modal-section">
          <h3>Základné informácie</h3>
          <p><strong>Profesia:</strong> {ad.profession}</p>
          <p><strong>Lokalita:</strong> {ad.location}</p>
          <p><strong>Status:</strong> {ad.status}</p>
        </div>

        {stats && (
          <div className="modal-section">
            <h3>Štatistiky</h3>
            <p>Zobrazenia: {stats.views}</p>
            <p>Počet kontaktov: {stats.contacts}</p>
            <p>Priemerné hodnotenie: {stats.rating} ⭐</p>
          </div>
        )}

        {history.length > 0 && (
          <div className="modal-section">
            <h3>História zmien</h3>
            <ul className="modal-list">
              {history.map((h) => (
                <li key={h.id}>
                  [{new Date(h.createdAt).toLocaleString()}] {h.user?.email} – {h.action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="modal-section">
            <h3>Recenzie</h3>
            <ul className="modal-list">
              {reviews.map((r) => (
                <li key={r.id}>
                  {r.rating} ⭐ – {r.text} ({r.author?.firstName} {r.author?.lastName})
                </li>
              ))}
            </ul>
          </div>
        )}

        {reports.length > 0 && (
          <div className="modal-section">
            <h3>Nahlásenia</h3>
            <ul className="modal-list">
              {reports.map((rep) => (
                <li key={rep.id}>
                  {rep.reason} – {rep.status} (nahlásil {rep.reporter?.email})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
