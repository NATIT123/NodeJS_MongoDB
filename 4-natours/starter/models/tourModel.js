const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  ratingsQuantity: {
    type: Number,
    required: [true, 'A tour must have quantity'],
  },
  ratingsAverage: {
    type: Number,
    required: [true],
    default: 4.5,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a duration'],
    default: 'easy',
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a maxGroupSize'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a imageCover'],
  },
  image: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
