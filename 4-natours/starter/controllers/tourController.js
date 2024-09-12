require('express');
const tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handleFactory');
const fs = require('fs');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

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

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  //   Đây là điều kiện lọc để tìm các tour du lịch có vị trí bắt đầu nằm trong một hình cầu.
  // startLocation: Tên trường trong bộ sưu tập tour đại diện cho vị trí bắt đầu của tour.
  // $geoWithin: Toán tử MongoDB để kiểm tra xem một điểm có nằm trong một hình học nào đó không.
  // $centerSphere: Toán tử MongoDB để tạo một hình cầu.
  // [[lng, lat], radius]:
  // [lng, lat]: Mảng chứa tọa độ tâm của hình cầu.
  // radius: Bán kính của hình cầu (đơn vị thường là mét).

  const tours = await tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
