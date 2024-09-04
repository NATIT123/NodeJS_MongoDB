const express = require('express');
const tourRoute = express.Router();
const tourController = require('../controllers/tourController');

tourRoute.param('id', tourController.checkId);

tourRoute
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.addTour);
tourRoute
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRoute;
