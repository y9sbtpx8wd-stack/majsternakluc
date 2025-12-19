import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

export function createChatSocket(chatId, onMessage) {
  const socket = io(SOCKET_URL, {
    transports: ['websocket'],
  });

  socket.emit('joinChat', { chatId });

  socket.on('newMessage', (msg) => {
    onMessage(msg);
  });

  return socket;
}
