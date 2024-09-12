const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const helmet = require('helmet');
const handleErrorGlobal = require('./controllers/errorController');
const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const viewRoute = require('./routes/viewRoutes');
require('./utils/dbConnect');

const app = express();

///Set up views Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

///Static Files
app.use(express.static(path.join(__dirname, 'public')));

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

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Hello from middlewares');
  next();
});

app.use((req, res, next) => {
  req.request = new Date().toISOString();
  console.log(req.cookies);
  next();
});

////Routes

app.use('/', viewRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);

app.all('*', (req, res, next) => {
  ///Stop all middleware and run immdiatelty to below
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(handleErrorGlobal);

module.exports = app;
