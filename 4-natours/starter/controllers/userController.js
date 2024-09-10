const express = require('express');
const User = require('../models/userModel');
const app = express();
const catchAsync = require('../utils/catchAsync');
app.use(express.json());

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      user: users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(404).json({
    status: 'failed',
    message: 'Page not found',
  });
};

exports.updateUser = (req, res) => {
  res.status(404).json({
    status: 'failed',
    message: 'Page not found',
  });
};

exports.getUser = (req, res) => {
  res.status(404).json({
    status: 'failed',
    message: 'Page not found',
  });
};

exports.deleteUser = (req, res) => {
  res.status(404).json({
    status: 'failed',
    message: 'Page not found',
  });
};
