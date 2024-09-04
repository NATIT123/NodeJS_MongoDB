const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');

//Middlewares
app.use(morgan('dev'));

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

module.exports = app;
