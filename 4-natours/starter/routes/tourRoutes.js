const express = require('express');
const tourRoute = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

// tourRoute.param('id', tourController.checkId);

// tourRoute.route('/tour-stats').get(tourController.getTourStats);

////Example:api/v1/tours/1/reviews: req.params.id =1
///Parent router: tourRoute , child router: reviewRouter
///When call api api/v1/tours/:id/reviews : can use parameter and body in both and access function handle in reviewRouter

tourRoute.use('/:tourId/reviews', reviewRouter);

tourRoute
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

tourRoute.route('/tour-stats').get(tourController.getTourStats);

tourRoute.route('/tour-stats-plan/:year').get(tourController.getMonthlyPlan);

tourRoute
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

tourRoute
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);

tourRoute
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.addTour
  );

tourRoute
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.deleteTour
  );

module.exports = tourRoute;
