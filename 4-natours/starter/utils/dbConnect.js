const mongoose = require('mongoose');
require('dotenv').config();
const mongoUrl =
  process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD) ||
  '';
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connect Database');
  })
  .catch((err) => console.log(err));
