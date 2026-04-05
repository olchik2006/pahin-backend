const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const treesRoutes = require('./routes/trees.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// ===== MIDDLEWARE =====
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pahin API is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/trees', treesRoutes);

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', status: 404 });
});

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== START =====
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();

module.exports = app;
