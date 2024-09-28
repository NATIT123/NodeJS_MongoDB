const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const productRoutes = require("./backend/routes/products");
const authRoutes = require("./backend/routes/auth");
require("./backend/utils/db");

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/products", productRoutes);
app.use("/", authRoutes);

app.listen(3100, () => {
  console.log("Sever is running");
});
