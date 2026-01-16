 const actionColor = {
  DELETE_LISTING: "#E53935",
  UPDATE_USER: "#2196F3",
  CREATE_INVOICE: "#4CAF50",
  ADMIN_API_CALL: "#673AB7",
};

export function RealtimeAuditLog({ logs }) {
  return (
    <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
      <h3>Realtime Audit Log</h3>

      <div style={{ maxHeight: 260, overflowY: "auto", marginTop: 10 }}>
        {logs.map((log, i) => (
          <div key={log.id ?? i} style={{ marginBottom: 10 }}>
            <span
              style={{
                background: actionColor[log.action] ?? "#555",
                color: "white",
                padding: "2px 6px",
                borderRadius: 4,
                marginRight: 6,
              }}
            >
              {log.action}
            </span>

            {log.details && (
              <span style={{ opacity: 0.7 }}>
                {JSON.stringify(log.details)}
              </span>
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
