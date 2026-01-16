'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { RealtimeAuditLog } from '@/components/admin/RealtimeAuditLog';
import { RealtimeApiLogs } from '@/components/admin/RealtimeApiLogs';
import { RealtimeErrorLogs } from '@/components/admin/RealtimeErrorLogs';
import { RealtimeChatMonitor } from '@/components/admin/RealtimeChatMonitor';

// 🔥 MiniGraph komponent
function MiniGraph({ values, color }: { values: number[]; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 2, height: 40, alignItems: 'flex-end' }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: Math.max(4, v * 0.4),
            background: color,
            borderRadius: 2,
            transition: 'height 0.2s',
          }}
        />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [daily, setDaily] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [topServices, setTopServices] = useState<any[]>([]);

  // 🔥 nové sekcie
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [monitoring, setMonitoring] = useState<any | null>(null);

  // 🔥 realtime logy
  const [apiLogs, setApiLogs] = useState<any[]>([]);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // 🔥 Realtime monitoring state
  const [rtHistory, setRtHistory] = useState({
    cpu: [] as number[],
    ram: [] as number[],
    latency: [] as number[],
    requests: [] as number[],
    errors: [] as number[],
    activeUsers: [] as number[],
    activeChats: [] as number[],
  });

  const fetchDashboard = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard-extended`);
    const data = await res.json();

    setStats(data.stats);
    setDaily(data.daily);
    setTopUsers(data.topUsers);
    setTopServices(data.topServices);

    setAiTips(data.aiTips || []);
    setMonitoring(data.monitoring || null);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

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

  // ---------------------------------------------------------
  // 🔥 REALTIME SOCKET LISTENERY
  // ---------------------------------------------------------
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL);

    // 🔥 1) Realtime monitoring (CPU, RAM, latency)
    socket.on('monitoring-update', (data) => {
      setRtHistory((prev) => ({
        cpu: [...prev.cpu.slice(-19), data.cpu],
        ram: [...prev.ram.slice(-19), data.ram],
        latency: [...prev.latency.slice(-19), data.latency],
        requests: [...prev.requests.slice(-19), data.requestsPerMinute],
        errors: [...prev.errors.slice(-19), data.errorsPerMinute],
        activeUsers: [...prev.activeUsers.slice(-19), data.activeUsers],
        activeChats: [...prev.activeChats.slice(-19), data.activeChats],
      }));
    });

    // 🔥 2) Realtime METRICS
    socket.on('metrics-update', (data) => {
      setRtHistory((prev) => ({
        ...prev,
        requests: [...prev.requests.slice(-19), data.requestsPerMinute],
        errors: [...prev.errors.slice(-19), data.errorsPerMinute],
        activeUsers: [...prev.activeUsers.slice(-19), data.activeUsers],
        activeChats: [...prev.activeChats.slice(-19), data.activeChats],
      }));
    });

    // 🔥 3) Realtime API request log
    socket.on('api-request-log', (log) => {
      setApiLogs((prev) => [log, ...prev.slice(0, 49)]);
    });

    // 🔥 4) Realtime error log
    socket.on('error-log', (err) => {
      setErrorLogs((prev) => [err, ...prev.slice(0, 49)]);
    });

    // 🔥 5) Realtime chat správy
    socket.on('chat-message', (msg) => {
      setChatMessages((prev) => [msg, ...prev.slice(0, 49)]);
    });

    // 🔥 6) Realtime audit log
    socket.on('audit-log', (entry) => {
      setAuditLogs((prev) => [entry, ...prev.slice(0, 49)]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      {/* 🔥 REALTIME AUDIT LOG */}
      <RealtimeAuditLog logs={auditLogs} />

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
      <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
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

      {/* 🔥 AI ODPORÚČANIA */}
      {aiTips.length > 0 && (
        <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
          <h3>AI odporúčania</h3>
          <ul>
            {aiTips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔥 MONITORING */}
      {monitoring && (
        <div className="grid" style={{ marginBottom: 20 }}>
          <div className="card round" style={{ padding: 20 }}>
            <h3>CPU</h3>
            <p>{monitoring.cpu}%</p>
            {bar(monitoring.cpu, '#4CAF50')}
          </div>

          <div className="card round" style={{ padding: 20 }}>
            <h3>RAM</h3>
            <p>{monitoring.ram}%</p>
            {bar(monitoring.ram, '#2196F3')}
          </div>

          <div className="card round" style={{ padding: 20 }}>
            <h3>API Latency</h3>
            <p>{monitoring.latency} ms</p>
            {bar(Math.min(monitoring.latency / 10, 100), '#FF9800')}
          </div>
        </div>
      )}

      {/* 🔥 REALTIME MONITORING — 7 GRAFOV */}
      <div className="grid" style={{ marginBottom: 20 }}>
        <div className="card round" style={{ padding: 20 }}>
          <h3>CPU (realtime)</h3>
          <MiniGraph values={rtHistory.cpu} color="#4CAF50" />
          <p style={{ marginTop: 8 }}>{rtHistory.cpu.at(-1) ?? '...'}%</p>
        </div>

        <div className="card round" style={{ padding: 20 }}>
          <h3>RAM (realtime)</h3>
          <MiniGraph values={rtHistory.ram} color="#2196F3" />
          <p style={{ marginTop: 8 }}>{rtHistory.ram.at(-1) ?? '...'}%</p>
        </div>

        <div className="card round" style={{ padding: 20 }}>
          <h3>API Latency (realtime)</h3>
          <MiniGraph values={rtHistory.latency} color="#FF9800" />
          <p style={{ marginTop: 8 }}>{rtHistory.latency.at(-1) ?? '...'} ms</p>
        </div>

        <div className="card round" style={{ padding: 20 }}>
          <h3>API Requests / min (realtime)</h3>
          <MiniGraph values={rtHistory.requests} color="#673AB7" />
          <p style={{ marginTop: 8 }}>{rtHistory.requests.at(-1) ?? '...'} req/min</p>
        </div>

        <div className="card round" style={{ padding: 20 }}>
          <h3>Errors / min (realtime)</h3>
          <MiniGraph values={rtHistory.errors} color="#E53935" />
          <p style={{ marginTop: 8 }}>{rtHistory.errors.at(-1) ?? '...'} errors/min</p>
        </div>

        <div className="card round" style={{ padding: 20 }}>
          <h3>Aktívni používatelia (realtime)</h3>
          <MiniGraph values={rtHistory.activeUsers} color="#009688" />
          <p style={{ marginTop: 8 }}>{rtHistory.activeUsers.at(-1) ?? '...'} users</p>
        </div>

        <div className="card round" style={{ padding: 20 }}>
          <h3>Aktívne chaty (realtime)</h3>
          <MiniGraph values={rtHistory.activeChats} color="#795548" />
          <p style={{ marginTop: 8 }}>{rtHistory.activeChats.at(-1) ?? '...'} chats</p>
        </div>
      </div>

      {/* 🔥 REALTIME API LOGY */}
      <RealtimeApiLogs logs={apiLogs} />

      {/* 🔥 REALTIME ERROR LOGY */}
      <RealtimeErrorLogs logs={errorLogs} />

      {/* 🔥 REALTIME CHAT MONITOR */}
      <RealtimeChatMonitor messages={chatMessages} />

    </div>
  );
}
