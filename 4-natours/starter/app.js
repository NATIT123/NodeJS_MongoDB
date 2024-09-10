const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const handleErrorGlobal = require('./controllers/errorController');
require('./utils/dbConnect');

const app = express();

///Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

//Set security HTTP headers
app.use(helmet());

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data santization againts NOSQL query injection
app.use(mongoSanitize());

//Data santization against XSS
app.use(xss());

//Prevent parameter poluttion
app.use(hpp());

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
