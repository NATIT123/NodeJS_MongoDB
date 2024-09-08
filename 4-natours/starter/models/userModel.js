const mongoose = require('mongoose');
const validataor = require('validator');
const bcrypt = require('bcrypt');

//name,email,photo,password,confirm Password

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validataor.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Plese provide your password'],
    minlength: 8,
    ////Not show password
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Plase provide your confirm password'],
    validate: {
      ///This only works on CREATE AND SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },

  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  ///Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  ///Hash the password with round of 12
  this.password = await bcrypt.hash(this.password, 12);

  ///Delete confirmPassowrd field
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (password, hashPassowrd) {
  return await bcrypt.compare(password, hashPassowrd);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
