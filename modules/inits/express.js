var session = require('express-session');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var csrf = require('csurf');
var flash = require('connect-flash');

module.exports = function(app,express,passport,db,config){
    
    //helmet security
    app.use(helmet.noCache());              //prevent client caching
    app.use(helmet.referrerPolicy());       //hide the Referer header
    app.use(helmet.xssFilter());            //small xss protections
    app.use(helmet.noSniff());              //prevent mime sniffing
    app.use(helmet.ieNoOpen());             //X-Download-Options for IE8+
    app.use(helmet.hidePoweredBy());        //remove the X-Powered-By header
    app.use(helmet.frameguard());           //prevent clickjacking
    app.use(helmet.dnsPrefetchControl());   //controls browser DNS prefetching
    
    //cookie and session setting
//    var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
//    var domain = '';
    app.use(session({
        name: config.helper.random_string(64),
        secret: config.helper.random_string(128),
        resave: false,
        saveUninitialized: true,
        cookie: false
    }));
    
    //header setting
    app.use(function (req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
    });
    
    //serve static files
    app.use(express.static('public')); //reverse proxy nginx here
    
    //misc node_modules setting and uses
    app.use('/',bodyParser.urlencoded({ extended: true }));
    app.use(csrf());
    app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)

        // handle CSRF token errors here
        res.status(403)
        res.send('Invalid CSRF Token.');
    });
    app.set('view engine', 'ejs');
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

};
