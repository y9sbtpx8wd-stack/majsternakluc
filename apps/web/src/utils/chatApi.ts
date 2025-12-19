const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function startChat(payload) {
  const res = await fetch(`${API_URL}/chat/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function sendMessage(chatId, sender, text) {
  const res = await fetch(`${API_URL}/chat/${chatId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, text }),
  });
  return res.json();
}

export async function getMessages(chatId) {
  const res = await fetch(`${API_URL}/chat/${chatId}/messages`);
  return res.json();
}
