import { Server } from 'socket.io';

let socketInstance;

const initializeSocket = (server) => {
  const origin = process.env.NODE_ENV === 'production' ? 'https://servicebridgesystem.onrender.com' : 'http://localhost:5173';

  const io = new Server(server, {
    cors: { 
      origin,
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true
    }
  });

  // Event listeners
  io.on('connection', (socket) => {
    console.log('A user connected with ID:', socket.id);
    socketInstance = socket

    socket.on('notifications', async ({message}) => {
      socket.emit('notifications', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};


  
  export { initializeSocket, socketInstance };