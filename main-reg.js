/*
 * NOTICE: ORDER OF IMPLEMENTATION IS CRUCIAL. ALTER AT YOUR OWN RISK
 */

var express = require('express');
//var multer = require('multer');
//var upload = multer();
var app = express();
var api = new express.Router();
var path = require("path");
var config = {
    app: require('./config/app'),
    db: require('./config/db'),
    api: require('./config/api'),
    helper: require('./config/helper')
};

//logger setting
var winston = require('winston');
var fs = require('fs');
var env = config.app.environment;
var logDir = 'log';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
var tsFormat = function () {
    (new Date()).toLocaleTimeString()
};
logger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: env === 'development' ? 'debug' : 'info'
        }),
        new (winston.transports.File)({
            filename: logDir + '/main-reg.log',
            timestamp: tsFormat,
            level: env === 'development' ? 'debug' : 'info'
        })
    ]
});
var db = require('./modules/db')(config, logger);

var passport = require('passport');
var jwt = require('jsonwebtoken');

//api routes and mount 
var bodyParser = require('body-parser');
api.use(bodyParser.urlencoded({
  extended: true
}));
//api.use(upload.array()); 

require('./routes/api/middleware')(api, config, logger);
require('./routes/api/auth')(api, passport, jwt, config, db, logger);
require('./routes/api-reg/routes')(api, passport, config, db, logger);
app.use('/api', api);

//init
require('./modules/inits/express')(app, express, passport, db, config);
require('./modules/inits/passport')(passport, db, config);

//routes
require('./routes/auth')(app, passport, logger);

logger.debug('App started as development');

app.listen(config.app.port_reg, function () {
    console.log('listening on ' + config.app.domain + ':' + config.app.port_reg);
});