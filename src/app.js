// Module imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');

// Route import
const routes = require('./routes');

// Environment variables
require('dotenv').config();

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

// Initiate our app
const app = express();
const port = process.env.PORT || 8008;

// CORS & Morgan
app.use(cors());
app.use(require('morgan')('dev'));

// BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Error handler
if (!isProduction) {
  app.use(errorHandler());
}

// Use Routes
app.use(routes);

// Listen on Port 8008
app.listen(port, () => console.log(`App started on ${port}`));
