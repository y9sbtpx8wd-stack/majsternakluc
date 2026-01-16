'use client';

import { useEffect, useState } from 'react';

export default function AdminMonitoringPage() {
  const [metrics, setMetrics] = useState<any | null>(null);

  const fetchMetrics = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/monitoring`);
    const data = await res.json();
    setMetrics(data);
  };

  useEffect(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, 15000);
    return () => clearInterval(id);
  }, []);

  if (!metrics) {
    return <div style={{ padding: 20 }}>Načítavam monitoring...</div>;
  }

  const bar = (value: number, color: string) => (
    <div style={{ background: '#eee', borderRadius: 8, overflow: 'hidden', height: 16 }}>
      <div
        style={{
          width: `${value}%`,
          background: color,
          height: '100%',
          transition: 'width 0.3s',
        }}
      />
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin – Monitoring</h1>

      <div className="grid" style={{ marginBottom: 20 }}>
        <div className="card round" style={{ padding: 16 }}>
          <h3>CPU</h3>
          <p>{metrics.cpu}%</p>
          {bar(metrics.cpu, '#4CAF50')}
        </div>

        <div className="card round" style={{ padding: 16 }}>
          <h3>RAM</h3>
          <p>{metrics.ram}%</p>
          {bar(metrics.ram, '#2196F3')}
        </div>

        <div className="card round" style={{ padding: 16 }}>
          <h3>API Latency</h3>
          <p>{metrics.latency} ms</p>
          {bar(Math.min(metrics.latency / 10, 100), '#FF9800')}
        </div>
      </div>

      <div className="card round" style={{ padding: 16 }}>
        <h3>Posledné API volania</h3>
        {metrics.requests?.map((r: any) => (
          <p key={r.id}>
            [{new Date(r.time).toLocaleTimeString()}] {r.method} {r.path} – {r.status} ({r.duration} ms)
          </p>
        ))}
      </div>
    </div>
  );
}
