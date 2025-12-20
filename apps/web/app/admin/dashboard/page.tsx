'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [daily, setDaily] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [topServices, setTopServices] = useState<any[]>([]);

  const fetchDashboard = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`);
    const data = await res.json();

    setStats(data.stats);
    setDaily(data.daily);
    setTopUsers(data.topUsers);
    setTopServices(data.topServices);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      {/* HLAVNÉ ŠTATISTIKY */}
      {stats && (
        <div className="grid" style={{ marginBottom: 20 }}>
          <div className="card round" style={{ padding: 20 }}>
            <h3>Počet dopytov</h3>
            <p style={{ fontSize: 28 }}>{stats.totalDemands}</p>
          </div>

          <div className="card round" style={{ padding: 20 }}>
            <h3>Počet inzerátov</h3>
            <p style={{ fontSize: 28 }}>{stats.totalListings}</p>
          </div>

          <div className="card round" style={{ padding: 20 }}>
            <h3>Počet používateľov</h3>
            <p style={{ fontSize: 28 }}>{stats.totalUsers}</p>
          </div>
        </div>
      )}

      {/* GRAF – dopyty za 30 dní */}
      <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
        <h3>Dopyty za posledných 30 dní</h3>

        <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
          {daily.map((d) => (
            <div
              key={d.date}
              style={{
                width: 10,
                height: d.count * 4,
                background: '#4CAF50',
                borderRadius: 4,
              }}
              title={`${d.date}: ${d.count}`}
            />
          ))}
        </div>
      </div>

      {/* TOP POUŽÍVATELIA */}
      <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
        <h3>Najaktívnejší používatelia</h3>
        <table style={{ width: '100%', marginTop: 12 }}>
          <thead>
            <tr>
              <th>Meno</th>
              <th>Dopyty</th>
              <th>Inzeráty</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.demands}</td>
                <td>{u.listings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOP SLUŽBY */}
      <div className="card round" style={{ padding: 20 }}>
        <h3>Najčastejšie služby</h3>
        <table style={{ width: '100%', marginTop: 12 }}>
          <thead>
            <tr>
              <th>Služba</th>
              <th>Počet dopytov</th>
            </tr>
          </thead>
          <tbody>
            {topServices.map((s) => (
              <tr key={s.service}>
                <td>{s.service}</td>
                <td>{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
