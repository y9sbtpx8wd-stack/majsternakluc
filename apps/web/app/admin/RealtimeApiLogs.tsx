type ApiLog = {
  id?: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  time?: string;
};

export function RealtimeApiLogs({ logs }: { logs: ApiLog[] }) {
  return (
    <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
      <h3>Realtime API logy</h3>
      <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 10 }}>
        {logs.length === 0 && (
          <p style={{ opacity: 0.6 }}>Zatiaľ žiadne API volania.</p>
        )}

        {logs.map((r, i) => (
          <p key={r.id ?? i} style={{ fontSize: 13 }}>
            [{r.time ? new Date(r.time).toLocaleTimeString() : 'now'}]{' '}
            <strong>{r.method}</strong> {r.path} – {r.status} ({r.duration} ms)
          </p>
        ))}
      </div>
    </div>
  );
}
