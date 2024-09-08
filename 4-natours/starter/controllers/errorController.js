const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/([""'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handeleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = (err) => {
  return new AppError('Your token has expired! Please log in again', 401);
};

const sendError = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(err);

  if (err.name === 'CastError') {
    err = handleCastErrorDB(err);
  }

  if (err.code === 11000) err = handleDuplicateFieldsDB(err);

  if (err.name === 'ValidationError') err = handeleValidationErrorDB(err);

  if (err.name === 'JsonWebTokenError') err = handleJWTError(err);

  if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);
  sendError(res, err);
};
