var redditAPI = require('../api/reddit');
var pollController = require("../controller/pollController");
const specs = require("../config/swagger.js");
const swaggerUi = require('swagger-ui-express');

module.exports = function (app, passport) {

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { 
      scope : ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

  // ===================================== 
  // DOCS ================================
  // =====================================
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs.default));

  // ===================================== 
  // SOCK ================================
  // =====================================  
  app.get("/socket", function(req, res) {
    res.render("socket.ejs");
  });


  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function (req, res) {
    res.render('index.ejs'); // load the index.ejs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function (req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home', 
    failureRedirect: '/login', 
    failureFlash: true 
  }));

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function (req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // =====================================
  // HOME ================================
  // =====================================
  app.get('/home', function (req, res) {
    redditAPI.getHomepage().then(function(data) {
      handleRoute(data, "home.ejs", req.headers, res, { posts: data });
    });
  });

  //Real API starts here
  // =====================================
  // POSTS ===============================
  // =====================================
  app.get('/post/:postid', function(req, res){
    redditAPI.getPost(req.params.postid).then(function(data){
      pollController.getPostPolls(data.name).then(function(pollData) {
        data.polls = pollData;
        handleRoute(data, "post.ejs", req.headers, res, { post: data });
      });
    });
  });

  // ===================================== 
  // POLLS ===============================
  // =====================================
  app.get('/poll/:pollid', function(req, res){
    pollController.getPoll({ pollId: req.params.pollid }).then(function(data) {
      handleRoute(data, "poll.ejs", req.headers, res, { poll: data });
    });
  });

  app.get("/poll", function(req, res) {
    pollController.getPoll(req.query).then(function(data) {
      handleRoute(data, "poll.ejs", req.headers, res, { poll: data });
    });
  });

  app.post('/poll', function(req, res){
    pollController.newPoll(req.body);
    res.end();
  });

  // ===================================== 
  // ANSWERS =============================
  // =====================================
  app.get('/poll/:pollid/answer/:answerid', function(req, res){
    pollController.getAnswer({ pollId: req.params.pollid, answerId: req.params.answerid }).then(function(data){
      handleRoute(data, 'answer.ejs', req.headers, res, {answer: data});
    });
  });

  app.get("/poll/:pollid/answer/:answerid/votes", function(req, res) {
    pollController
      .getVotes({ pollId: req.params.pollid, answerId: req.params.answerid })
      .then(function(data) {
        res.json(data);
    });
  });

  app.get("/answer", function(req, res) {
    pollController
      .getAnswer(req.query)
      .then(function(data) {
        handleRoute(data, "answer.ejs", req.headers, res, { answer: data });
      });
  });
};


//Handles routes by json or html
function handleRoute(data, view, headers, res, sendData){
  if (headers.type === "json") {
    res.json(data);
  } else {
    res.render(view, sendData);
  }
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}