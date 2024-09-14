const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const viewRouter = express.Router();

viewRouter.get('/', authController.isLoggedIn, viewController.getOverview);
viewRouter.get(
  '/tour/:slug',
  authController.isLoggedIn,
  viewController.getTour
);
///Login
viewRouter.get(
  '/login',
  authController.isLoggedIn,
  viewController.getLoginForm
);
viewRouter.get('/me', authController.protect, viewController.getAccount);

viewRouter.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = viewRouter;
