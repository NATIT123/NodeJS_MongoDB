require('express');
const tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handleFactory');
const fs = require('fs');

exports.getAllTours = factory.getAll(tour);

exports.getTour = factory.getOne(tour, { path: 'reviews' });
exports.addTour = factory.createOne(tour);

exports.updateTour = factory.updateOne(tour);

exports.deleteTour = factory.deleteOne(tour);

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        //////Group by coloumn-----$toUpper:'$difficulty'
        _id: '$duration',
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPirce: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPirce: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      tour: stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  const plans = await tour.aggregate([
    ///Array: each of value
    {
      $unwind: '$startDates',
    },

    {
      ////Having
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      /////Group by
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    {
      $addFields: { month: '$_id' },
    },

    {
      ////Select 1:to show,0 :not show
      $project: {
        _id: 0,
      },
    },

    {
      $sort: { numTourStarts: -1 },
    },

    {
      $limit: 12,
    },
  ]);

  if (!plans) {
    return next(new AppError('No tour found with that year', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: plans,
    },
  });
});
