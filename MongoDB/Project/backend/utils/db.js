const mongodb = require("mongodb").MongoClient;
mongodb
  .connect("mongodb://127.0.0.1:27017/persons", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((client) => {
    console.log("Connected!");
    client.close();
  })
  .catch((err) => {
    console.log(err);
  });
