const express = require('express');
const app = express();
app.use(express.json());

exports.getAllUsers = (req, res) => {
  res.status(404).json({
    status: 'failed',
    message: 'Page not found',
  });
};

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
