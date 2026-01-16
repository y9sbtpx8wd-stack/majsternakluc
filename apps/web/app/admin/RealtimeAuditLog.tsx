type AuditLogEntry = {
  id?: string;
  action: string;
  details?: any;
  createdAt?: string;
  userId?: string;
};

export function RealtimeAuditLog({ logs }: { logs: AuditLogEntry[] }) {
  return (
    <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
      <h3>Realtime Audit Log</h3>
      <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 10 }}>
        {logs.length === 0 && (
          <p style={{ opacity: 0.6 }}>Zatiaľ žiadne admin akcie.</p>
        )}

        {logs.map((log, i) => (
          <div
            key={log.id ?? i}
            style={{
              padding: '6px 0',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              fontSize: 13,
            }}
          >
            <div>
              <strong>{log.action}</strong>
            </div>
            {log.details && (
              <div style={{ opacity: 0.7 }}>
                {JSON.stringify(log.details)}
              </div>
            )}
            {log.createdAt && (
              <div style={{ fontSize: 11, opacity: 0.5 }}>
                {new Date(log.createdAt).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

