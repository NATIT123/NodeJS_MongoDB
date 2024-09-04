const express = require('express');
const fs = require('fs');
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

const writeFile = (tours, newTour) => {
  fs.writeFileSync(
    `./dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          newTour,
        },
      });
    }
  );
};

exports.checkBody = (req, res, next) => {
  console.log(req.body);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'failed',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.checkId = (req, res, next, value) => {
  const id = value * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(200).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    message: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.addTour = (req, res) => {
  const length = tours.length;
  const newTour = { id: tours[length - 1].id + 1, ...req.body };
  tours.push(newTour);
  writeFile(tours, newTour);
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  const { duration } = req.body;

  const newTour = { ...tour, duration };
  console.log(newTour);
  const listTour = tours.filter((el) => el.id !== id);
  const newListTour = [...listTour, newTour];
  writeFile(newListTour, newTour);
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  const listTour = tours.filter((el) => el.id !== id);
  writeFile(listTour, tour);
};
