'use strict'

const express = require('express');
const app = express();
const blogPostsRouter = require('./blogPostsRouter')
const mongoose = require('mongoose')
const morgan = require('morgan');
const { BlogPost } = require('./models')
const { PORT, DATABASE_URL } = require('./config')

mongoose.Promise = global.Promise

// log the http layer
app.use(morgan('tiny'));

app.use(express.json())

// app.use('/blog-posts', blogPostsRouter)
app.use('/', blogPostsRouter)

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err)
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`)
        resolve()
      })
        .on('error', err => {
          mongoose.disconnect()
          reject(err)
        })
    })
  })
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);          
        }
        resolve();
      });
    });
  })
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};

