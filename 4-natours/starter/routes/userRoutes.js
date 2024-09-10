const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

userRoute.post('/signUp', authController.signUp);
userRoute.post('/login', authController.login);

userRoute.post('/forgotPassword', authController.forgotPassword);
userRoute.patch('/resetPassword/:token', authController.resetPassword);
userRoute.patch(
  '/changePassword/:id',
  authController.protect,
  authController.changePassword
);
userRoute.patch(
  '/updateUser/:id',
  authController.protect,
  authController.updateUser
);

userRoute.delete(
  '/deleteUser/:id',
  authController.protect,
  authController.deleteUser
);

userRoute
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRoute
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    userController.deleteUser
  );

module.exports = userRoute;
