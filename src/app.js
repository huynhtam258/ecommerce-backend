require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
var cors = require('cors')
const app = express();
app.use(cors())

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

// init factory
const configFactories = require('./factories')
console.log(configFactories)

// handling error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})
module.exports = app