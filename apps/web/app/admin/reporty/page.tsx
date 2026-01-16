'use client';

import { useEffect, useState } from 'react';

function ReportDetailModal({ report, onClose }: { report: any; onClose: () => void }) {
  if (!report) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Detail nahlásenia</h2>

        <div className="modal-section">
          <h3>Typ</h3>
          <p>{report.type}</p>
        </div>

        <div className="modal-section">
          <h3>Dôvod</h3>
          <p>{report.reason}</p>
        </div>

        <div className="modal-section">
          <h3>Nahlásil</h3>
          <p>{report.reporter?.firstName} {report.reporter?.lastName} ({report.reporter?.email})</p>
        </div>

        <div className="modal-section">
          <h3>Cieľ</h3>
          <p>{report.targetName}</p>
        </div>

        <div className="modal-section">
          <h3>Stav</h3>
          <p>{report.status}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminReportyPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<any | null>(null);

  const fetchReports = async () => {
    const params = new URLSearchParams();
    if (filter) params.append('type', filter);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/reports?${params.toString()}`
    );
    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resolveReport = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/${id}/resolve`, {
      method: 'PATCH',
    });
    fetchReports();
  };

  const dismissReport = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/${id}/dismiss`, {
      method: 'PATCH',
    });
    fetchReports();
  };

  const deleteTarget = async (id: string, type: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/delete-target`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type }),
    });
    fetchReports();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin – Nahlásenia</h1>

      <select
        className="round"
        style={{ padding: 8, marginBottom: 20 }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">Všetky typy</option>
        <option value="listing">Inzeráty</option>
        <option value="demand">Dopyty</option>
        <option value="review">Recenzie</option>
        <option value="user">Používatelia</option>
      </select>

      <div className="grid">
        {reports.map((r) => (
          <div
            key={r.id}
            className="card round"
            style={{ padding: 16, cursor: 'pointer' }}
            onClick={() => setSelected(r)}
          >
            <h3>Nahlásenie #{r.id}</h3>
            <p><strong>Typ:</strong> {r.type}</p>
            <p><strong>Dôvod:</strong> {r.reason}</p>
            <p><strong>Nahlásil:</strong> {r.reporter?.email}</p>
            <p><strong>Stav:</strong> {r.status}</p>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                className="button"
                style={{ background: '#4CAF50' }}
                onClick={(e) => {
                  e.stopPropagation();
                  resolveReport(r.id);
                }}
              >
                Vyriešiť
              </button>

              <button
                className="button"
                style={{ background: '#999' }}
                onClick={(e) => {
                  e.stopPropagation();
                  dismissReport(r.id);
                }}
              >
                Zamietnuť
              </button>

              <button
                className="button"
                style={{ background: '#e53935' }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTarget(r.targetId, r.type);
                }}
              >
                Zmazať obsah
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ReportDetailModal report={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
