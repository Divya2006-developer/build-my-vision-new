const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase, db } = require('./config/db');
const seed = require('./seeds/seedData');

const authRoutes = require('./routes/authRoutes');
const designerRoutes = require('./routes/designerRoutes');
const projectRoutes = require('./routes/projectRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static directory for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach io to app so controllers can emit real-time events
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/designers', designerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Health & Database status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'Build My Vision — Design Collaboration Platform',
    database: db.getMode(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/db-status', (req, res) => {
  res.json({
    mode: db.getMode(),
    description: db.getMode() === 'mysql' 
      ? 'Connected to MySQL relational database engine' 
      : 'Running with local persistent store. Configure DB_PASSWORD in server/.env to bind to MySQL Server.'
  });
});

// Serve frontend static files if built
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// For any non-API route, serve index.html (SPA routing support)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Socket.io real-time connection logic
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Join user room for targeted notifications
  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`[Socket] User ${userId} joined room user_${userId}`);
  });

  // Join project collaboration room
  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`[Socket] Socket ${socket.id} joined project_${projectId}`);
  });

  // Typing indicator
  socket.on('typing', ({ projectId, userName, isTyping }) => {
    socket.to(`project_${projectId}`).emit('user_typing', {
      userName,
      isTyping
    });
  });

  // Leave project room
  socket.on('leave_project', (projectId) => {
    socket.leave(`project_${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const dbResult = await initDatabase();
    console.log(`[Server] Database initialized in mode: ${dbResult.mode}`);

    // If database has 0 designers, automatically run seed
    const designers = await db.designers.listAll();
    if (designers.length === 0) {
      console.log('[Server] Database is empty. Running initial seed...');
      await seed();
    }

    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Build My Vision Server running on http://localhost:${PORT}`);
      console.log(`📡 Socket.IO Real-Time Engine Active`);
      console.log(`💾 Database Mode: ${db.getMode().toUpperCase()}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('[Server Error] Failed to start:', err);
  }
}

startServer();
