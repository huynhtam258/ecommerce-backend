require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();


// init  middlewwares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.connect');
checkOverload()
// init routes

// handling error

module.exports = app