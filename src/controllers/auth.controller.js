const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json(data);
  } catch (e) {
    if (e.message === 'User already exists') {
      return res.status(409).json({ message: e.message });
    }
    res.status(400).json({ message: e.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.status(200).json(data);
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
};

const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };
