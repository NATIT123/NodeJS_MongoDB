const mongoose = require("mongoose");
const mongoUrl =
  "mongodb+srv://tuosama1234:hMq4qDeN6QN3hV57@cluster0.oto34.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoUrl, {})
  .then(() => {
    console.log("Connect Database");
  })
  .catch((err) => console.log(err));
