const express = require('express');
const userRoute = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const upload = multer({ dest: 'public/img/users' });
userRoute.post('/signUp', authController.signUp);
userRoute.post('/login', authController.login);

userRoute.post('/forgotPassword', authController.forgotPassword);
userRoute.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
userRoute.use(authController.protect);

userRoute.patch('/updateMyPassword', authController.changePassword);
userRoute.get('/me', userController.getMe, userController.getUser);
userRoute.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
userRoute.delete('/deleteMe', userController.deleteMe);

userRoute.use(authController.restrictTo('admin'));

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
