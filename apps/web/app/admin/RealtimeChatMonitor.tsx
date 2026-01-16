type ChatMessage = {
  id?: string;
  chatId?: string;
  senderId?: string;
  content: string;
  createdAt?: string;
};

export function RealtimeChatMonitor({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="card round" style={{ padding: 20, marginBottom: 20 }}>
      <h3>Realtime chat správy</h3>
      <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 10 }}>
        {messages.length === 0 && (
          <p style={{ opacity: 0.6 }}>Zatiaľ žiadne správy.</p>
        )}

        {messages.map((m, i) => (
          <div key={m.id ?? i} style={{ fontSize: 13, marginBottom: 6 }}>
            <div>
              <strong>{m.senderId ?? 'user'}</strong>:{' '}
              <span>{m.content}</span>
            </div>
            {m.createdAt && (
              <div style={{ fontSize: 11, opacity: 0.5 }}>
                {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
