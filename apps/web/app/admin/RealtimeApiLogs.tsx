import { useState, useMemo } from "react";

type ApiLog = {
  id?: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  time?: string;
};

const methodColor = {
  GET: "#4CAF50",
  POST: "#2196F3",
  PUT: "#FF9800",
  DELETE: "#E53935",
};

const statusColor = (status: number) => {
  if (status >= 500) return "#E53935"; // red
  if (status >= 400) return "#FB8C00"; // orange
  if (status >= 300) return "#1976D2"; // blue
  return "#4CAF50"; // green
};

export function RealtimeApiLogs({ logs }: { logs: ApiLog[] }) {
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 20;

  // GROUPING
  const grouped = useMemo(() => {
    const filtered = logs.filter((l) => {
      if (methodFilter && l.method !== methodFilter) return false;
      if (statusFilter && !String(l.status).startsWith(statusFilter)) return false;
      if (textFilter && !JSON.stringify(l).toLowerCase().includes(textFilter.toLowerCase()))
        return false;
      return true;
    });

    const groups: Record<string, ApiLog[]> = {};
    filtered.forEach((log) => {
      if (!groups[log.path]) groups[log.path] = [];
      groups[log.path].push(log);
    });

    return groups;
  }, [logs, methodFilter, statusFilter, textFilter]);

  const groupKeys = Object.keys(grouped);

  const paginated = groupKeys.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
      <h3>Realtime API logy</h3>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
          <option value="">Metóda</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Status</option>
          <option value="2">2xx</option>
          <option value="3">3xx</option>
          <option value="4">4xx</option>
          <option value="5">5xx</option>
        </select>

        <input
          placeholder="Hľadať text…"
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {/* GROUPED LOGS */}
      <div style={{ maxHeight: 260, overflowY: "auto", marginTop: 10 }}>
        {paginated.map((path) => (
          <div key={path} style={{ marginBottom: 12 }}>
            <h4 style={{ opacity: 0.7 }}>{path}</h4>

            {grouped[path].map((r, i) => (
              <div key={r.id ?? i} style={{ fontSize: 13, marginBottom: 4 }}>
                <span
                  style={{
                    background: methodColor[r.method],
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: 4,
                    marginRight: 6,
                  }}
                >
                  {r.method}
                </span>

                <span
                  style={{
                    background: statusColor(r.status),
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: 4,
                    marginRight: 6,
                  }}
                >
                  {r.status}
                </span>

                [{r.time ? new Date(r.time).toLocaleTimeString() : "now"}] –{" "}
                {r.duration} ms
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Predchádzajúca
        </button>
        <button
          disabled={page * pageSize >= groupKeys.length}
          onClick={() => setPage((p) => p + 1)}
        >
          Ďalšia
        </button>
      </div>
    </div>
  );
}
