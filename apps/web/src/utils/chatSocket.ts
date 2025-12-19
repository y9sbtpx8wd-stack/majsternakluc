import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function createChatSocket(
  chatId: string,
  onMessage: (msg: any) => void
): Socket {
  const socket: Socket = io(SOCKET_URL, {
    transports: ['websocket'],
  });

  socket.emit('joinChat', { chatId });

  socket.on('newMessage', (msg) => {
    onMessage(msg);
  });

  return socket;
}

