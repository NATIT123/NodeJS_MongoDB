const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: x. Please use another value`;
  return new AppError(message, 400);
};

const handeleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
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

  console.log(err.path);

  if (err.name === 'CastError') {
    err = handleCastErrorDB(err);
  }

  if (err.code === 11000) err = handleDuplicateFieldsDB(err);

  if (err.name === 'ValidationError') err = handeleValidationErrorDB(err);

  sendError(res, err);
};
