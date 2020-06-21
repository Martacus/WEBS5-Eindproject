var redditAPI = require('../api/reddit');
var pollController = require("../controller/pollController");
const specs = require("../config/swagger.js");
const swaggerUi = require('swagger-ui-express');

module.exports = function (app, passport) {

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    app.get('/auth/facebook', passport.authenticate('facebook', { 
      scope : ['public_profile', 'email']
    }));

    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

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
  app.get("/socket", isLoggedIn, function(req, res) {
    res.render("polls/socket.ejs");
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

  app.get('/login', function (req, res) {
    res.render('auth/login.ejs', { message: req.flash('loginMessage') }); 
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home', 
    failureRedirect: '/login', 
    failureFlash: true 
  }));

  // =====================================
  // SIGNUP ==============================
  // =====================================
  app.get('/signup', function (req, res) {
    res.render('auth/signup.ejs', { message: req.flash('signupMessage') });
  });


  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('polls/profile.ejs', {
      user: req.user
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
  app.get('/home', isLoggedIn, function (req, res) {
    redditAPI.getHomepage().then(function(data) {
      handleRoute(data, "polls/home.ejs", req, res, { posts: data });
    });
  });

  //Real API starts here
  // =====================================
  // POSTS ===============================
  // =====================================
  app.get('/post/:postid', isLoggedIn, function(req, res){
    redditAPI.getPost(req.params.postid).then(function(data){
      pollController.getPostPolls(data.name).then(function(pollData) {
        data.polls = pollData;
        data.user = req.user;
        handleRoute(data, "polls/post.ejs", req, res, { post: data });
      });
    });
  });

  // ===================================== 
  // POLLS ===============================
  // ===================================== 
  app.get('/poll/:pollid', function(req, res){
    pollController.getPoll({ pollId: req.params.pollid }).then(function(data) {
      handleRoute(data, "polls/poll.ejs", req, res, { poll: data });
    });
  });

  app.get('/poll/create/:postid', isLoggedIn, function (req, res) {
    handleRoute({ post: { postid: req.params.postid } }, "polls/create.ejs", req, res, { post: {postid: req.params.postid} });
  });

  app.get("/poll", function(req, res) {
    pollController.getPoll(req.query).then(function(data) {
      handleRoute(data, "polls/poll.ejs", req, res, { poll: data });
    });
  });

  app.post('/poll', function(req, res){
    pollController.newPoll(req.body, req.user);
    res.redirect('/post/' + req.body.postId);
  });

  // ===================================== 
  // ANSWERS =============================
  // =====================================
  app.get('/user/:userid/poll/:pollid/answer/:answerid', function (req, res) {
    pollController.getPollByUser(req.params.userid, req.params.pollid).then(function (data) {
      if (data === null || data === undefined) {
        res.json({ error: "No poll was found" });
      }
      else {
        data.answers.forEach(element => {
          if (element.answerId === req.params.answerid){
            res.json(element);
            next();
          }
        });
        res.json({error: "Answer was not found"});
        next();
      }
    });
  });

  app.get('/user/:userid/poll/:pollid/answers', function (req, res) {
    pollController.getPollByUser(req.params.userid, req.params.pollid).then(function (data) {
      if (data === null || data === undefined) {
        res.json({ error: "No poll was found" });
      }
      else {
        res.json(data.answers);
        next();
      }
    });
  });

  app.get("/poll/:pollid/answer/:answerid/votes", function(req, res) {
    pollController
      .getVotes({ pollId: req.params.pollid, answerId: req.params.answerid })
      .then(function(data) {
        res.json(data);
    });
  });
};

function handleRoute(data, view, req, res, sendData){
  if (req.headers.type === "json") {
    res.json(data);
  } else {
    sendData.loggedIn = req.isLogged;
    res.render(view, sendData);
  }
}

function isLoggedIn(req, res, next) {
  if (req.headers.type === "json") {
    return next();
  }
  if (req.isAuthenticated()) {
    req.isLogged = true
    return next();
  }
  res.redirect('/');
}