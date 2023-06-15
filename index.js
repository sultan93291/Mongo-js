const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');

// express app initialization
const app = express();
app.use(express.json());

//database connection with mongoose

mongoose
  .connect('mongodb://127.0.0.1:27017/todos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongodb connected successfully');
  })
  .catch(err => console.log(err));

// app route

app.use('/todo', todoHandler);
app.use('/user', userHandler);

// defaul error handler
const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res.status(500).json({ error: err });
};

app.use(errorHandler);

// app routes

app.listen(3000, () => {
  console.log('listening on port 3000');
});
