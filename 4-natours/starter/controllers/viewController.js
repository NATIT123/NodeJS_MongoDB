const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.find({ slug: req.params.slug });
  //   .populate({
  //     path: 'reviews',
  //     fields: 'review rating user',
  //   });

  console.log(tour.imageCover);

  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
  });
});
