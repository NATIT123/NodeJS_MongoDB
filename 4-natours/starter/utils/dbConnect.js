const mongoose = require('mongoose');
const dotenv = require('dotenv');
///Enviroment Variables
dotenv.config({ path: './config.env' });
const mongoUrl =
  process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD) ||
  '';
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connect Database');
  })
  .catch((err) => console.log(err));
