const User = require("../models/user");
const bcrypt = require("bcryptjs");
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
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("errors", "Invalid email or password.");
      return res.redirect("/login");
    }

    const check = await bcrypt.compare(password, user.password);
    console.log(check);
    if (!check) {
      req.flash("errors", "Invalid email or password.");
      return res.redirect("/login");
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
  } catch (err) {
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
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignUp = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.redirect("/signup");
    }
    if (password != confirmPassword) {
      return res.redirect("/signup");
    }
    const hashpassword = await bcrypt.hash(password, 12);
    const userNew = await User.create({ name, email, password: hashpassword });
    req.session.isLoggedIn = true;
    req.session.user = userNew;
    req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
  } catch (err) {
    res.redirect("/signup");
    console.log(err);
  }
};
