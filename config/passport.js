// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require("passport-google-oauth20");
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// load up the user model
var User = require('../models/user');

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function (passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
  },
    function (req, email, password, done) {
      console.log(req.body);
      process.nextTick(function () {
        User.findOne({ 'local.email': email }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            var newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            if (
              newUser.local.email == "mcpkmart@hotmail.nl" ||
              newUser.local.email == "martvdham@gmail.com"
            ) {
              newUser.role = "admin";
            } else {
              newUser.role = "user";
            }
            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }

        });

      });

    }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
  },
  function (req, email, password, done) {
    User.findOne({ 'local.email': email }, function (err, user) {
      if (err)
        return done(err);

      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.'));

      var set = user.validPassword(password);

      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

      return done(null, user);
    });

  }));

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({
      clientID        : configAuth.facebookAuth.clientID,
      clientSecret    : configAuth.facebookAuth.clientSecret,
      callbackURL     : configAuth.facebookAuth.callbackURL
  },
  function(token, refreshToken, profile, done) {
      process.nextTick(function() {
          User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
              if (err)
                  return done(err);
              if (user) {
                  return done(null, user); // user found, return that user
              } else {
                  var newUser = new User();
                  newUser.facebook.id    = profile.id; // set the users facebook id                   
                  newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                  newUser.facebook.name =  profile.displayName; // look at the passport user profile to see how names are returned
                  newUser.role = "user";
                  //newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, newUser);
                  });
              }
          });
      });
  }));

  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(new GoogleStrategy({
      clientID        : configAuth.googleAuth.clientID,
      clientSecret    : configAuth.googleAuth.clientSecret,
      scope: 'profile',
      callbackURL     : configAuth.googleAuth.callbackURL,
  },
  function(token, refreshToken, profile, done) {
      process.nextTick(function() {
          User.findOne({ 'google.id' : profile.id }, function(err, user) {
              if (err)
                  return done(err);
              if (user) {
                  return done(null, user);
              } else {
                console.log(JSON.stringify(profile));
                  var newUser          = new User();
                  newUser.google.id    = profile.id;
                  newUser.google.token = token;
                  newUser.google.name  = profile.displayName;
                  newUser.google.email = profile.emails[0].value; // pull the first email
                  newUser.role = "user";
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, newUser);
                  });
              }
          });
      });
  })); 
  
  // =========================================================================
  // JWT ==================================================================
  // =========================================================================
  passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'watermelonlemon'
    },
    function (jwtPayload, cb) {

        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return UserModel.findOneById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));
};