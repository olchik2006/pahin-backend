const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === '23505') {
    statusCode = 409;
    message = 'Такий запис вже існує';
  }

  if (err.code === '23503') {
    statusCode = 400;
    message = "Пов'язаний запис не знайдено";
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Невалідний токен авторизації';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Токен авторизації прострочений';
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
