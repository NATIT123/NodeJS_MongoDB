const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");

const flash = require("connect-flash");

const User = require("./models/user");

const errorController = require("./controllers/error");

require("./util/dbConnect");
const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const csrfProtection = csrf();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const MONGODB_URI =
  "mongodb+srv://tuosama1234:hMq4qDeN6QN3hV57@cluster0.oto34.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn || false;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

app.listen(port, () => {
  console.log(`Listening on Port:${port}`);
});
