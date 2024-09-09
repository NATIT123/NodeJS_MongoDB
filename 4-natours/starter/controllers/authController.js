const User = require('../models/userModel');
const { promisify } = require('util');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/nodeMailer');

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signInToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  ////Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  ///Check if email and password is not correct
  const user = await User.findOne({ email }).select('+password');
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect email and password', 401));
  }

  const token = signInToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  /////Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  //Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECERT);
  console.log(decoded);

  ///Check if users is exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user beloging to this token does no longer exist', 401)
    );
  }

  ///Check if user changed password after the token was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password!', 401));
  }

  ///Grant access to protected route
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  ///Get user based on POST email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  //Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //Send it to user's email
  const resetURL = `${req.protocol}://̀${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forgot your password, plesae ignore this`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    console.log(err.message);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  ///Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  ///If token has not experied,and there is user,set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expeired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: true });

  //update changePasswordAt property for the user

  ///Log the user in, send JWT
  const token = signInToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
