import { Server } from 'socket.io';
import Notification from '../model/Notification.js';
import jwt from 'jsonwebtoken'
import cookie from 'cookie';
import Admin from '../model/Admin.js';

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

io.on('connection', (socket) => {
  // Parse cookies from the handshake header
  const cookies = cookie.parse(socket.handshake.headers.cookie || '');

  // Get the 'jwt' token from the cookies
  const token = cookies.jwt;

  if (!token) {
    console.log('No JWT token found in cookies');
    socket.disconnect();  // Disconnect if no token is present
    return;
  }

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the socket
    socket.user = decodedToken;

    // Handle socket events
    socket.on('notifications', async ({ limit }) => {
      const deliveredNotifications = await Notification.countDocuments({admin_id: decodedToken.id, status: 'Delivered'});
      const total = await Notification.countDocuments({admin_id: decodedToken.id});
      const notifications = await Notification.find({admin_id: decodedToken.id}).limit(limit).sort({ createdAt: -1 });
      socket.emit('notifications',{notifications, deliveredNotifications, total});
    });

    socket.on('update-notification', async ({ id }) => {
      await Notification.findByIdAndUpdate(id, { status: 'Seen' });
    });

  } catch (err) {
    console.log('Error verifying token:', err.message);
    socket.disconnect(); // Disconnect if token is malformed or verification fails
  }
  socketInstance = socket;
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

}

 export { initializeSocket, socketInstance };