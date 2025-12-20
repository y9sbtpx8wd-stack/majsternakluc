'use client';

import { useEffect, useState } from 'react';
import { Listing } from '@/lib/types';

export default function ChatWidget({
  ad,
  onClose,
}: {
  ad: Listing | null;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!ad) return;

    // Načítanie histórie
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${ad.id}`)
      .then((res) => res.json())
      .then(setMessages);

    // Online status
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/online/${ad.id}`)
      .then((res) => res.json())
      .then((d) => setOnline(d.online));
  }, [ad]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId: ad?.id, message: input }),
    });

    setMessages((prev) => [...prev, { fromMe: true, text: input }]);
    setInput('');
  };

  if (!ad) return null;

  return (
    <div className="chat-backdrop" onClick={onClose}>
      <div className="chat-window" onClick={(e) => e.stopPropagation()}>
        <button className="chat-close" onClick={onClose}>
          ×
        </button>

        <h2 className="chat-title">
          Chat s {ad.firstName} {ad.lastName}
        </h2>
        <p className="chat-subtitle">
          {online ? '🟢 Online' : '🔴 Offline'} • História 30 dní
        </p>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.fromMe ? 'msg-me' : 'msg-them'}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Napíšte správu..."
          />
          <button className="chat-send" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
