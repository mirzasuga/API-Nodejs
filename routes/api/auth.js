var bcrypt = require('bcrypt-nodejs');
var md5 = require('md5');

module.exports = function(api,passport,jwt,config,db,logger){
    api.post("/",function(req, res) {
        res.json({status:"success",message: ''});
        logger.verbose("api access: welcome ("+req.url+")");
    });
    api.post("/test-whoami",passport.authenticate('jwt', { session: false}) ,function(req, res) {
        res.json({status:"success",message: req.user.email_id});
        logger.verbose("api who am i: "+req.user.email_id);
    });
};
