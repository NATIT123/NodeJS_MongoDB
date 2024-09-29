const Router = require("express").Router;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = Router();

const User = require("../models/user");

const createToken = () => {
  return jwt.sign({}, "secret", { expiresIn: "1h" });
};

router.post("/login", async (req, res, next) => {
  try {
    const email = req.body.email;
    const pw = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({
        message: "Authentication failed, invalid username or password.",
      });
    }

    const check = await bcrypt.compare(pw, user.password);
    if (!check) {
      res.status(401).json({
        message: "Authentication failed, invalid username or password.",
      });
    }
    const token = createToken();
    res.status(200).json({
      message: "Authentication succeed",
      token: token,
    });
  } catch (err) {
    res.status(401).json({
      message: "Authentication failed, invalid username or password.",
    });
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const email = req.body.email;
    const pw = req.body.password;
    let haspassword;
    // Hash password before storing it in database => Encryption at Rest
    await bcrypt
      .hash(pw, 12)
      .then((hashedPW) => {
        // Store hashedPW in database
        haspassword = hashedPW;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Creating the user failed." });
      });
    const token = createToken();
    const user = await User.create({ email: email, password: haspassword });
    res.status(201).json({ token: token, email: user.email });
    // Add user to database
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Creating the user failed." });
  }
});

module.exports = router;
