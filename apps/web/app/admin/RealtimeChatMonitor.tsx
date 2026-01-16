type ChatMessage = {
  id?: string;
  chatId?: string;
  senderId?: string;
  content: string;
  createdAt?: string;
};

export function RealtimeChatMonitor({ messages }: { messages: ChatMessage[] }) {
  const grouped: Record<string, ChatMessage[]> = {};

  messages.forEach((m) => {
    const key = m.chatId ?? "unknown";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  return (
    <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
      <h3>Realtime chat správy</h3>

      <div style={{ maxHeight: 260, overflowY: "auto", marginTop: 10 }}>
        {Object.keys(grouped).map((chatId) => (
          <div key={chatId} style={{ marginBottom: 12 }}>
            <h4 style={{ opacity: 0.7 }}>Chat #{chatId}</h4>

            {grouped[chatId].map((m, i) => (
              <div
                key={m.id ?? i}
                style={{
                  fontSize: 13,
                  marginBottom: 6,
                  padding: 6,
                  background: "#f5f5f5",
                  borderRadius: 6,
                }}
              >
                <strong>{m.senderId ?? "user"}</strong>: {m.content}
                <div style={{ fontSize: 11, opacity: 0.5 }}>
                  {m.createdAt && new Date(m.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
