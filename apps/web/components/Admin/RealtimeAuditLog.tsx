export function RealtimeAuditLog({ logs }) {
  return (
    <div className="card round" style={{ padding: 20 }}>
      <h3>Realtime Audit Log</h3>

      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{log.action}</strong>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {JSON.stringify(log.details)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
