require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
var cors = require('cors')
const app = express();
app.use(cors());

// init  middlewwares
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())
app.use(morgan('dev'));

app.use(helmet.frameguard({
    action: 'deny'
}));
// strict transport security
const reqDuration = 2629746000;
app.use(
    helmet.hsts({
        maxAge: reqDuration,
    })
);

// content security policy
app.use(helmet.contentSecurityPolicy({
    directives: {
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
    },
}))
// x content type options
app.use(helmet.noSniff());
// x xss protection
app.use(helmet.xssFilter())
// referrer policy
app.use(helmet.referrerPolicy({
    policy: "no-referrer",
}))

// app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload()

// init swagger
const {openApi, configSwagger} = require('./configs/config.swagger')
openApi(app)

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
        stack: req.stack,
        message: error.message || 'Internal Server Error'
    })
})
module.exports = app