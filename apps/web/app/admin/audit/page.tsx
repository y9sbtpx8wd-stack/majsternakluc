'use client';

import { useEffect, useState } from 'react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [entity, setEntity] = useState('');
  const [user, setUser] = useState('');

  const fetchLogs = async () => {
    const params = new URLSearchParams();
    if (entity) params.append('entity', entity);
    if (user) params.append('user', user);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/audit?${params.toString()}`
    );
    const data = await res.json();
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin – Audit log</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          placeholder="Entity (listing, demand, user...)"
          className="round"
          style={{ padding: 8 }}
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
        />
        <input
          placeholder="Používateľ (email)"
          className="round"
          style={{ padding: 8 }}
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <button className="button" onClick={fetchLogs}>
          Filtrovať
        </button>
      </div>

      <div className="card round" style={{ padding: 16 }}>
        {logs.map((l) => (
          <div key={l.id} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 13, opacity: 0.7 }}>
              {new Date(l.createdAt).toLocaleString()} • {l.user?.email} • {l.entity} #{l.entityId}
            </div>
            <div>
              <strong>{l.action}</strong>
            </div>
            {l.before && l.after && (
              <pre style={{ fontSize: 12, background: '#f5f5f5', padding: 8, borderRadius: 8 }}>
{JSON.stringify({ before: l.before, after: l.after }, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
