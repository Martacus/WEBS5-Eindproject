var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');

var app = express();


// Database connection
var configDB = require('./config/database.js');
mongoose.connect(process.env.MONGOLAB_URI || configDB.url);

require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + 'public'));

app.use(morgan('dev'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport Setup
app.use(session({ secret: 'ilovewatermelon' }))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// load our routes and pass in our app and fully configured passport
require('./routes/routes.js')(app, passport); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log("<!------ Error: " + err.message + "-------!>");
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
