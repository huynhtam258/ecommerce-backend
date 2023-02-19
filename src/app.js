const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan')
const app = express();


// init  middlewwares
app.use(morgan('dev'));
app.use(helmet())
app.use(compression())

// init db

// init routes

// handling error

module.exports = app