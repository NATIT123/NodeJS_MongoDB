const express = require('express');
const tourRoute = express.Router();
const tourController = require('../controllers/tourController');

// tourRoute.param('id', tourController.checkId);

tourRoute.route('/tour-stats').get(tourController.getTourStats);
tourRoute
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.addTour);

tourRoute
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
tourRoute.route('/tour-stats-plan/:year').get(tourController.getMonthlyPlan);

module.exports = tourRoute;
