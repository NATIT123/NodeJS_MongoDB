const express = require('express');
const fs = require('fs');
const port = 8080;

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const writeFile = (tours, newTour) => {
  fs.writeFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          newTour,
        },
      });
    }
  );
};

app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ message: 'success', results: tours.length, data: { tours } });
});

app.post('/api/v1/tours', (req, res) => {
  const length = tours.length;
  const newTour = { id: tours[length - 1].id + 1, ...req.body };
  tours.push(newTour);
  writeFile(tours, newTour);
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.get('/api/v2/tours', (req, res) => {
  const { a, b } = req.query;
  console.log(a, b);
  res.status(200).json({
    status: 'success',
    data: {
      a,
      b,
    },
  });
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(200).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }

  const { duration } = req.body;

  const newTour = { ...tour, duration };
  console.log(newTour);
  const listTour = tours.filter((el) => el.id !== id);
  const newListTour = [...listTour, newTour];
  writeFile(newListTour, newTour);
});

app.listen(port, () => {
  console.log(`Listening on Port:${port}`);
});
