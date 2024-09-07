require('express');
const tour = require('../models/tourModel');
const fs = require('fs');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(200).json({
      status: 'failed',
      message: err,
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
