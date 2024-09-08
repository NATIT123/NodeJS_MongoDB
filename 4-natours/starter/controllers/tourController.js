require('express');
const tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fs = require('fs');

exports.getAllTours = catchAsync(async (req, res, next) => {
  ///BUILD QUERY
  ///1)Filtering
  const queryObj = { ...req.query };
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach((el) => delete queryObj[queryObj]);

  // 2) Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  console.log(queryStr);
  ///duration[gte]=5&difficulty=easy=>{difficulty:'easy',duration:{gte:'5'}}
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log(JSON.parse(queryStr));
  // let tours = await tour.find(JSON.parse(queryStr));

  let tours = await tour.find();

  ///3 Pagination
  let { page, limit, skip } = req.query;
  page = page * 1 || 1;
  limit = limit * 1 || 100;
  skip = (page - 1) * limit;

  console.log(page, limit, skip);

  console.log(tours.length);

  //page3&limit=10 ,1-10, page 1, 11-20, page 2, 21-30 page 3
  ///Way1
  // tours = tours.slice(skip, skip + limit);
  ///Way2
  tours = await tour.aggregate([
    { $sort: { pirce: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);
  if (page) {
    const numTours = await tour.countDocuments();
    if (skip > numTours) throw new Error('This is page does not exist');
  }

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  // ///Check ID is valid
  // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
  //   return next(new AppError('Id is not valid', 404));
  // }

  const tourDetail = await tour.findOne({ _id: id });
  if (!tourDetail) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tourDetail },
  });
});

exports.addTour = catchAsync(async (req, res, next) => {
  const newTour = await tour.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  // ///Check ID is valid
  // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
  //   return next(new AppError('Id is not valid', 404));
  // }

  const tourUpdate = await tour.findByIdAndUpdate(
    id,
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!tourUpdate) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tourUpdate,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  // ///Check ID is valid
  // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
  //   return next(new AppError('Id is not valid', 404));
  // }

  const tourDelete = await tour.findByIdAndDelete(id);

  if (!tourDelete) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
});

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
