//var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User;

module.exports = function(passport, db, config) {
        
    //passport signup
//    passport.use('local-signup', new LocalStrategy({
//        usernameField : 'email',
//        passwordField : 'password',
//        passReqToCallback : true
//    },function(req, email, password, done) {
//        var query = User.findOne({ 'local.email' : email });
//        query.exec(function(err, user) {
//            if (err){return done(err);}  
//            else if (user) {
//                return done(null, false, req.flash('danger', 'That email is already taken.'));
//            } else {
//                var newUser            = new User();
//                newUser.local.email    = email;
//                newUser.local.password = newUser.generateHash(password);
//                Object.keys(config.defaults.user).forEach(function(key){
//                    newUser[key] = config.defaults.user[key];
//                });
//                newUser.save(function(err) {
//                    if (err)
//                        throw err;
//                    return done(null, newUser);
//                });
//            }
//        });
//    }));
    
    //passport login
//    passport.use('local-login', new LocalStrategy({
//        usernameField : 'email',
//        passwordField : 'password',
//        passReqToCallback : true 
//    },
//    function(req, email, password, done) {
//        var query = User.findOne({ 'local.email' :  email });
//        query.exec(function(err, user) {
//            if (err)
//                return done(err);
//            if (!user||!user.validPassword(password))
//                return done(null, false, req.flash('danger', 'Email and Password does not match'));
//            return done(null, user);
//        });
//    }));
    
    //API
    passport.use(new JwtStrategy({
        secretOrKey: config.api.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
    }, function(jwt_payload, done) {
        db.driver.getFromID({id: jwt_payload.id},function(rows){
            if (rows[0] !== undefined) {
                done(null, rows[0]);
            } else {
                done(null, false);
            }
        });
    }));
};