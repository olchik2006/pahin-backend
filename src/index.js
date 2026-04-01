const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const treesRoutes = require('./routes/trees.routes');
require('dotenv').config();
require('./config/database');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/trees', treesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pahin API is running' });
});

const PORT = process.env.PORT || 5000;
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
