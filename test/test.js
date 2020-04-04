var chai = require("chai");
var expect = require('chai').expect;
var should = require('chai').should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");

//Models
var User = require('../models/user');
var Answer = require('../models/answer');
var Poll = require('../models/poll');

//Reddit.js
var redditjs = require('../api/reddit');

var app = require('express')();
require("../config/passport")(passport);
// Passport Setup
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// load our routes and pass in our app and fully configured passport
require('../routes/routes.js')(app, passport); 

describe('Testing poll routes', function(){
  describe('without params', function(){
    it('should return an object', function(done){
      chai
        .request('http://localhost:3000')
        .get("/poll")
        .set("type", "json")
        .end((err, res) => {
          expect(err, "Error occured.").to.be.null;
          expect(
            res,
            `Status was not 200, was ${res.status} instead`
          ).to.have.status(200);
          expect(res.body, "Body was null.").to.not.be.null;
          done();
        });
    });
  })
});

describe("Testing models", function() {
  describe("test answers", function() {
    it("should return that the id is not long enough", function(done) {
      var answer = new Answer();
      answer.answer = "Oke";
      answer.pollId = "6668796786576787967865767879678657";

      var error = answer.validateSync();
      expect(error.message).to.equal('Answer validation failed: pollId: The UUID is not of the right length');
      done();
    });

    it("should return that the answer is right", function(done) {
      var answer = new Answer();
      answer.answer = "Oke";
      answer.pollId = "666879678657678796786576787967865767";

      var error = answer.validateSync();
      expect(error).to.be.undefined;
      done();
    });

    it("answer cant be longer than 50 letters", function(done) {
      var answer = new Answer();
      answer.answer = "Okeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww";
      answer.pollId = "666879678657678796786576787967865767";

      var error = answer.validateSync();
      expect(error.message).to.not.be.undefined;
      done();
    });
  });

  describe('test polls', function(){
    it("should not error", function(done) {
      var poll = new Poll();
      poll.name = "Test Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;

      var error = poll.validateSync();
      expect(error).to.be.undefined;
      done();
    });

    it("saving poll works", function(done) {
      var poll = new Poll();
      poll.name = "Testing Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;

      poll.save();

      expect(Poll.findByUUID(poll.pollId)).to.not.be.undefined;
      expect(Poll.findByPost(poll.postId)).to.not.be.undefined;

      Poll.deleteOne({pollId: poll.pollId});

      done();
    });
  });

  describe("test user", function() {
    it("should not error", function(done) {
      var poll = new Poll();
      poll.name = "Test Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;

      var error = poll.validateSync();
      expect(error).to.be.undefined;
      done();
    });

    it("saving poll works", function(done) {
      var poll = new Poll();
      poll.name = "Testing Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;

      poll.save();

      expect(Poll.findByUUID(poll.pollId)).to.not.be.undefined;
      expect(Poll.findByPost(poll.postId)).to.not.be.undefined;

      Poll.deleteOne({ pollId: poll.pollId });

      done();
    });
  });

  describe("test redditjs", function() {
    it("GetHomePage should not be null", function(done) {
      var homepageData = redditjs.getHomepage();
      expect(homepageData).to.not.be.undefined;
      done();
    });

    // it("GetPost with random should error", async function(done) {
    //   var homepageData = await redditjs
    //     .getPost("random")
    //     .then(result => result.data);
    //   console.log('LALLA GETS GERE');
    //   expect(homepageData).to.not.be.undefined;
    //   done();
    // });

    // it("GetPost with valid should be object", async function(done) {
    //   var homepageData = {};
    //   homepageData = await redditjs.getPost("t3_fqhrut");
    //   expect(homepageData).to.not.be.undefined;
    //   done();
    // });
  });
});

