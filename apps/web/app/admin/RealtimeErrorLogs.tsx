type ErrorLog = {
  id?: string;
  message: string;
  stack?: string;
  time?: string;
};

export function RealtimeErrorLogs({ logs }: { logs: ErrorLog[] }) {
  return (
    <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
      <h3>Realtime chyby</h3>
      <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 10 }}>
        {logs.length === 0 && (
          <p style={{ opacity: 0.6 }}>Zatiaľ žiadne chyby.</p>
        )}

        {logs.map((e, i) => (
          <div key={e.id ?? i} style={{ fontSize: 13, marginBottom: 6 }}>
            <div style={{ color: '#e53935' }}>
              [{e.time ? new Date(e.time).toLocaleTimeString() : 'now'}]{' '}
              {e.message}
            </div>
            {e.stack && (
              <pre
                style={{
                  fontSize: 11,
                  opacity: 0.6,
                  whiteSpace: 'pre-wrap',
                  marginTop: 2,
                }}
              >
                {e.stack}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
