const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    // ///Check ID is valid
    // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //   return next(new AppError('Id is not valid', 404));
    // }

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new AppError(`No document found with that ID`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: null,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    // ///Check ID is valid
    // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //   return next(new AppError('Id is not valid', 404));
    // }

    const document = await Model.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!document) {
      return next(new AppError(`No document found with that ID`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    // ///Check ID is valid
    // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //   return next(new AppError('Id is not valid', 404));
    // }

    ///Return join collection child references and auto parse value according to _id
    const document = Model.findById(id);

    if (popOptions) document = document.populate(popOptions);

    const doc = await document;

    //  await tour.findById(id);
    // await tour.findById(id).populate('guides');
    // console.log(tourDetail);
    // await tour.findOne({ _id: id });
    if (!tourDetail) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    ///To Allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter, req.query))
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { data: docs },
    });
  });
