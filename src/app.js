require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();


// init  middlewwares
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload()

// init routes
app.use('/', require('./routes'));

// handling error

module.exports = app