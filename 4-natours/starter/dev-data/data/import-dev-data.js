require('../../utils/dbConnect');
const fs = require('fs');
const tour = require('../../models/tourModel');

//READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

///Import data into DB
const importData = async () => {
  try {
    await tour.create(tours);
    console.log('Load DB successfully');
  } catch (err) {
    console.log(err);
  }
};

//Delete all data from DB
const deleteData = async () => {
  try {
    await tour.deleteMany();
    console.log('Delete DB successfully');
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);
