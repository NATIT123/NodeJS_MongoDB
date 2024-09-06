///////11111
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//////222222

/////Routes

/////Tours

// app.route('/api/v1/tours').get(getAllTours).post(addTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

///Users

// app.route('/api/v1/users').get(getAllUsers).post(createUser);

// app
//   .route('/api/v1/users/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

////Routes - stack middleware

const app = require('./app');
const port = process.env.PORT || 8080;

///Enviroment Variables
dotenv.config({ path: './config.env' });

app.listen(port, () => {
  console.log(`Listening on Port:${port}`);
});
