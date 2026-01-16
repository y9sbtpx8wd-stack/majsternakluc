'use client';

import { useEffect, useState } from 'react';

function ReviewDetailModal({ review, onClose }: { review: any; onClose: () => void }) {
  if (!review) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Detail recenzie</h2>

        <div className="modal-section">
          <h3>Hodnotenie</h3>
          <p>{review.rating} ⭐</p>
        </div>

        <div className="modal-section">
          <h3>Text</h3>
          <p>{review.text}</p>
        </div>

        <div className="modal-section">
          <h3>Autor</h3>
          <p>{review.author?.firstName} {review.author?.lastName} ({review.author?.email})</p>
        </div>

        <div className="modal-section">
          <h3>Cieľ</h3>
          <p>{review.targetName}</p>
        </div>

        <div className="modal-section">
          <h3>Stav</h3>
          <p>{review.status}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminRecenziePage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchReviews = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews`);
    const data = await res.json();
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const hideReview = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews/${id}/hide`, {
      method: 'PATCH',
    });
    fetchReviews();
  };

  const publishReview = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews/${id}/publish`, {
      method: 'PATCH',
    });
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews/${id}`, {
      method: 'DELETE',
    });
    fetchReviews();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin – Recenzie</h1>

      <div className="grid">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="card round"
            style={{ padding: 16, cursor: 'pointer' }}
            onClick={() => setSelected(r)}
          >
            <h3>{r.rating} ⭐</h3>
            <p>{r.text.slice(0, 100)}...</p>
            <p className="muted">Autor: {r.author?.firstName} {r.author?.lastName}</p>
            <p className="muted">Cieľ: {r.targetName}</p>
            <p>Status: {r.status}</p>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                className="button"
                style={{ background: '#999' }}
                onClick={(e) => {
                  e.stopPropagation();
                  hideReview(r.id);
                }}
              >
                Skryť
              </button>

              <button
                className="button"
                style={{ background: '#4CAF50' }}
                onClick={(e) => {
                  e.stopPropagation();
                  publishReview(r.id);
                }}
              >
                Zverejniť
              </button>

              <button
                className="button"
                style={{ background: '#e53935' }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteReview(r.id);
                }}
              >
                Zmazať
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ReviewDetailModal review={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
