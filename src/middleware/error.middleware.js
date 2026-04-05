const AppError = require('../utils/AppError');

const handleDBDuplicateError = (err) => {
  const match = err.detail?.match(/\((.+?)\)=\((.+?)\)/);
  const value = match ? match[2] : 'value';
  return new AppError(`Значення "${value}" вже існує`, 409);
};

const handleDBForeignKeyError = () => new AppError("Пов'язаний запис не знайдено", 400);

const handleDBNotNullError = (err) =>
  new AppError(`Поле "${err.column || 'field'}" є обов'язковим`, 400);

const handleJWTError = () => new AppError('Невалідний токен. Будь ласка, увійдіть знову.', 401);

const handleJWTExpiredError = () =>
  new AppError('Токен прострочений. Будь ласка, увійдіть знову.', 401);

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      message: err.message,
      status: err.statusCode,
      stack: err.stack,
    });
  }

  let error = { ...err, message: err.message, isOperational: err.isOperational };

  if (error.code === '23505') error = handleDBDuplicateError(error);
  if (error.code === '23503') error = handleDBForeignKeyError();
  if (error.code === '23502') error = handleDBNotNullError(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      message: error.message,
      status: error.statusCode,
    });
  }

  console.error('UNEXPECTED ERROR 💥', err);
  return res.status(500).json({
    message: 'Щось пішло не так. Спробуйте пізніше.',
    status: 500,
  });
};

module.exports = errorHandler;
