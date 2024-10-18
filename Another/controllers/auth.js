const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.EMAIL_HOST,
  secure: false,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("errors");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    res.setHeader("Set-Cookie", "loggedIn=true;HttpOnly");
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password.",
        oldInput: {
          email,
          password,
        },
      });
    }

    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password.",
        oldInput: {
          email,
          password,
        },
        validationErrors: errors.array(),
      });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
  } catch (err) {
    // const error = new Error(err);
    // error.httpStatusCode = 500;
    // return next(error);
    res.redirect("/login");
    console.log(err);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("errors");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
    validationErrors: [],
    oldInput: {
      email: "",
      password: "",
      name: "",
    },
  });
};

exports.postSignUp = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email: email });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email,
          password,
          name,
        },
        validationErrors: errors.array(),
      });
    }
    if (user) {
      req.flash("errors", "Email has been used");
      return res.redirect("/signup");
    }
    if (password != confirmPassword) {
      req.flash("errors", "Password and confirm password must be match.");
      return res.redirect("/signup");
    }
    const hashpassword = await bcrypt.hash(password, 12);
    const userNew = await User.create({ name, email, password: hashpassword });
    await transporter.sendMail({
      to: process.env.EMAIL_AUTH_USER,
      from: "test@example.com",
      subject: "Test",
      html: "<h1>Welcome</h1>",
    });
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
  } catch (err) {
    res.redirect("/signup");
    console.log(err);
  }
};

exports.getReset = (req, res, next) => {
  let message = req.flash("errors");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = async (req, res, next) => {
  let token;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    token = buffer.toString("hex");
  });
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("errors", "No account with that email found.");
      return res.redirect("/reset");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    await transporter.sendMail({
      to: process.env.EMAIL_AUTH_USER,
      from: "test@example.com",
      subject: "Password reset",
      html: `<p>You requested a password reset</p>
            <p>Click this link <a href="http://localhost:3000/reset/${token}">link</a>to set a new passoword</p>
      `,
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (user) {
      let message = req.flash("errors");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      return res.render("auth/new-password", {
        path: "/reset",
        pageTitle: "Updaste Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    }
    req.flash("errors", "Link has been expired");
    return res.redirect("/reset");
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const { newPassword, passwordToken, userId } = req.body;
  try {
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    if (user) {
      const hashpassword = await bcrypt.hash(newPassword, 12);
      user.password = hashpassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
      return res.redirect("/login");
    }
    req.flash("errors", "Link has been expired");
    return res.redirect("/reset");
  } catch (err) {
    console.log(err);
  }
};
