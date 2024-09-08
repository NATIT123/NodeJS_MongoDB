const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

userRoute.post('/signUp', authController.signUp);
userRoute.post('/login', authController.login);

userRoute
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRoute
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRoute;
