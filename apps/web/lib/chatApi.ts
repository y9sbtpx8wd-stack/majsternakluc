const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface StartChatPayload {
  userA: string;
  userB: string;
}

export interface SendMessagePayload {
  chatId: string;
  sender: string;
  text: string;
}

export async function startChat(payload: StartChatPayload) {
  const res = await fetch(`${API_URL}/chat/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to start chat');
  }

  return res.json();
}

export async function sendMessage(payload: SendMessagePayload) {
  const res = await fetch(`${API_URL}/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to send message');
  }

  return res.json();
}

export async function getMessages(chatId: string) {
  const res = await fetch(`${API_URL}/chat/${chatId}/messages`);

  if (!res.ok) {
    throw new Error('Failed to load messages');
  }

  return res.json();
}
