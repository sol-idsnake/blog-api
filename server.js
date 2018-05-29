const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

const {blogSeeds} = require('./seeds')

// log the http layer
app.use(morgan('common'));

