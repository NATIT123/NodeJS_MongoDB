const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('../models/userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    slug: String,
    ratingsQuantity: {
      type: Number,
      required: [true, 'A tour must have quantity'],
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      min: [5, 'Rating must be below 5.0'],
      required: [true],
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10,
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
    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      ///GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        _id: String,
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    ////Embedding data
    // guides: Array,

    ///child reference
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/////Document Middleware:runs before .save() and .create()

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

////Way 1 -Embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
//   next();
// });

// tourSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordChangedAt',
//   });

//   next();
// });

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds `);
//   next();
// });

// ///
// tourSchema.index({ price: 1, ratingsAverage: -1 });
// tourSchema.index({ slug: 1 });
// tourSchema.index({ startLocation: '2dsphere' });

// ////Show value tour query populate
// tourSchema.virtual('reviewss', {
//   ref: 'Review',
//   foreignField: 'tour',
//   localField: '_id',
// });

// ///Aggreation middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
