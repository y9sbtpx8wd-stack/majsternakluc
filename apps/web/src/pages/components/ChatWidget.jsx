import React, { useEffect, useState, useRef } from 'react';
import { startChat, sendMessage, getMessages } from '../../utils/chatApi';
import { createChatSocket } from '../../utils/chatSocket';

export function ChatWidget({ ad, onClose }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages when chatId exists
  useEffect(() => {
    if (!chatId) return;

    getMessages(chatId).then((msgs) => setMessages(msgs));

    socketRef.current = createChatSocket(chatId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [chatId]);

  async function handleSend() {
    if (!input.trim()) return;

    // 1) If chat not started → start it
    if (!chatId) {
      const chat = await startChat({
        listingId: ad.id,
        listingTitle: ad.title,
        firstMessage: input,
      });

      setChatId(chat.id);
      setMessages([
        {
          id: 'temp',
          sender: 'customer',
          text: input,
          createdAt: new Date().toISOString(),
        },
      ]);

      setInput('');
      return;
    }

    // 2) If chat exists → send message
    const msg = await sendMessage(chatId, 'customer', input);
    setMessages((prev) => [...prev, msg]);
    setInput('');
  }

  return (
    <div className="chat-backdrop" onClick={onClose}>
      <div className="chat-window" onClick={(e) => e.stopPropagation()}>
        <button className="chat-close" onClick={onClose}>×</button>

        <h3 className="chat-title">Chat s remeselníkom</h3>
        <p className="chat-subtitle">{ad.title}</p>

        <div className="chat-messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.sender === 'customer' ? 'msg msg-me' : 'msg msg-them'}
            >
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Napíšte správu..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="chat-send" onClick={handleSend}>Poslať</button>
        </div>
      </div>
    </div>
  );
}
