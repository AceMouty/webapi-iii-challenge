const express = require('express');
const server = express();
const userRoutes =  require('./users/userRouter')

// Set logger here
server.use(logger) // <= logger

// teach server how to use json
server.use(express.json())

// Custom Routes
server.use('/api/user', userRoutes)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});


server.use(errorHandler)

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.path} at [${new Date().toISOString()}]`)
  next()
};

function errorHandler(err, req, res, next) {
  console.log(err)
}

module.exports = server;
