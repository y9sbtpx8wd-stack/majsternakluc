import { useState } from "react";

type ErrorLog = {
  id?: string;
  message: string;
  stack?: string;
  time?: string;
};

export function RealtimeErrorLogs({ logs }: { logs: ErrorLog[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
      <h3>Realtime chyby</h3>

      <div style={{ maxHeight: 260, overflowY: "auto", marginTop: 10 }}>
        {logs.map((e, i) => {
          const key = e.id ?? String(i);
          return (
            <div key={key} style={{ marginBottom: 10 }}>
              <div
                onClick={() => toggle(key)}
                style={{
                  cursor: "pointer",
                  color: "#E53935",
                  fontWeight: 600,
                }}
              >
                [{e.time ? new Date(e.time).toLocaleTimeString() : "now"}]{" "}
                {e.message}
              </div>

              {open[key] && e.stack && (
                <pre
                  style={{
                    fontSize: 11,
                    opacity: 0.7,
                    whiteSpace: "pre-wrap",
                    background: "#f8f8f8",
                    padding: 10,
                    borderRadius: 6,
                    marginTop: 4,
                  }}
                >
                  {e.stack}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
