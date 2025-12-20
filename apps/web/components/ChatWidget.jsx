'use client';

import { useEffect, useState } from 'react';
import { Listing } from '@/lib/types';

type Demand = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  content: string;
};

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

  // 🔥 nový stav pre dopyt
  const [demand, setDemand] = useState<Demand | null>(null);

  // 🔥 otvorenie chatu pre dopyt
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem('chat-demand');
      if (stored) {
        setDemand(JSON.parse(stored));
      }
    };

    window.addEventListener('open-demand-chat', handler);
    return () => window.removeEventListener('open-demand-chat', handler);
  }, []);

  // 🔥 načítanie histórie pre inzerát alebo dopyt
  useEffect(() => {
    if (ad) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${ad.id}`)
        .then((res) => res.json())
        .then(setMessages);

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/online/${ad.id}`)
        .then((res) => res.json())
        .then((d) => setOnline(d.online));
    }

    if (demand) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages-demand/${demand.id}`)
        .then((res) => res.json())
        .then(setMessages);
    }
  }, [ad, demand]);

  // 🔥 odoslanie správy
  const sendMessage = async () => {
    if (!input.trim()) return;

    if (ad) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad.id, message: input }),
      });
    }

    if (demand) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/send-demand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demandId: demand.id, message: input }),
      });
    }

    setMessages((prev) => [...prev, { fromMe: true, text: input }]);
    setInput('');
  };

  // 🔥 ak nie je ani inzerát ani dopyt → nič nezobrazuj
  if (!ad && !demand) return null;

  const title = ad
    ? `Chat s ${ad.firstName} ${ad.lastName}`
    : `Odpoveď na dopyt – ${demand?.firstName} ${demand?.lastName}`;

  const subtitle = ad
    ? `${online ? '🟢 Online' : '🔴 Offline'} • História 30 dní`
    : `História 30 dní`;

  return (
    <div className="chat-backdrop" onClick={onClose}>
      <div className="chat-window" onClick={(e) => e.stopPropagation()}>
        <button className="chat-close" onClick={onClose}>
          ×
        </button>

        <h2 className="chat-title">{title}</h2>
        <p className="chat-subtitle">{subtitle}</p>

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
