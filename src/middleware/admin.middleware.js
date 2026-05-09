const AppError = require('../utils/AppError');

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Доступ заборонено', 403));
  }
  next();
};

module.exports = adminMiddleware;
