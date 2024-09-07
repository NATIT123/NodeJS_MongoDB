require('express');
const tour = require('../models/tourModel');
const collection = require('collect.js');
const fs = require('fs');

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err.message);
    res.status(200).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const id = req.params.id;
    // const tourDetail = await tour.findById(id);
    const tourDetail = await tour.findOne({ _id: id });
    res.status(200).json({
      status: 'success',
      data: { tourDetail },
    });
  } catch (err) {
    res.status(200).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.addTour = async (req, res) => {
  try {
    const newTour = await tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.body);
    const tourUpdate = await tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        tour: tourUpdate,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const id = req.params.id;
    await tour.findByIdAndDelete(id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
    console.log(stats);
    res.status(200).json({
      status: 'success',
      data: {
        tour: stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
