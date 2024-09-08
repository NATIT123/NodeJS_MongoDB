const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const AppError = require('./utils/appError');
const handleErrorGlobal = require('./controllers/errorController');
require('./utils/dbConnect');

const app = express();
app.use(express.json());

///Enviroment Variables
dotenv.config({ path: './config.env' });

///Static Files
app.use(express.static(`${__dirname}/public`));

const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');

//Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Hello from middlewares');
  next();
});

app.use((req, res, next) => {
  req.request = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  ///Stop all middleware and run immdiatelty to below
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(handleErrorGlobal);

module.exports = app;
