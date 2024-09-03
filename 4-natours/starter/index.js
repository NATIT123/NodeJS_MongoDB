const express = require('express');
const fs = require('fs');
const port = 8080;

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ message: 'success', results: tours.length, data: { tours } });
});

app.post('/api/v1/tours', (req, res) => {
  const length = tours.length;
  const newTour = { id: tours[length - 1].id + 1, ...req.body };
  tours.push(newTour);
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
});

app.listen(port, () => {
  console.log(`Listening on Port:${port}`);
});
