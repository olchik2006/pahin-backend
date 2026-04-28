const router = require('express').Router();
const { register, login, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Забагато спроб. Спробуйте через 15 хвилин.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', authMiddleware, logout);

module.exports = router;
