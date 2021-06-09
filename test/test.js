var chai = require("chai");
var expect = require('chai').expect;
var should = require('chai').should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
var request = require('chai').request;

//Models
var User = require('../models/user');
var Answer = require('../models/poll.answer');
var Poll = require('../models/poll');

//Reddit.js
var redditjs = require('../api/reddit');
const { assert } = require("chai");

//Controllers
var pollController = require('../controller/pollController');
const poll = require("../models/poll");

var app = require('express')();
require("../config/passport")(passport);
// Passport Setup
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// load our routes and pass in our app and fully configured passport
require('../routes/routes.js')(app, passport); 

describe('Testing routes', async function() {

  it('Should login succesfully', function (done) {
    request(app)
    .post('/login')
    .send({
      email: 'akshay6@akshay6.nl',
      password: 'akshay6'
    })
    .end((err, res) => {
      if(err) { return done(err) }
      console.log(res.error)
    })
    
    done();
  })


  it("Route '/signup' should return a page", function (done) {
    request(app)
      .get("/signup")
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

  it("/signup should return a redirect", function (done) {
    request(app)
      .post("/signup")
      .set("type", "json")
      .send({
        email: 'crackhead@crackhead.nl',
        password: 'crackhead'
      })  
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

  it("Route '/login' should return a page", function (done) {
    request(app)
      .get("/login")
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

  it("Route /login should be status 200", function (done) {
    request(app)
      .post("/login")
      .set("type", "json")
      .send({
        email: 'cracked@cracked.nl',
        password: 'cracked'
      })  
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

describe('Testing modules' ,async function() {  
  it('Poll has a module', () => {
    expect(Poll).to.not.be.undefined;
  });

  it('User has a module', () => {
    expect(Poll).to.not.be.undefined;
  });

  it('Answer has a module', () => {
    expect(Poll).to.not.be.undefined;
  });
})

describe('Testing users', async function(){
  it('User has a module', () => {
    expect(User).to.not.be.undefined;
  });
})

describe('Testing reddit api', async function(){
  it('getHomePage should return object with filled array', async function(){
    await redditjs.getHomepage().then(data => {
      expect(data).not.empty;
    })
  });

  it("getPost should return a post", async function () {
    await redditjs.getPost("t3_hd213b").then((data) => {
      expect(data).to.not.be.undefined;
    });
  });

  it("getPost should not return a post", async function () {
    await redditjs.getPost("t3_hd213bygjfhgjfjgf").then((data) => {
      expect(data).to.be.string;
    });
  });
});

// describe("Testing poll routes", function () {
//   describe("without params", function () {
//     it("should return an object", function (done) {
//       request(app)
//         .get("/poll")
//         .set("type", "json")
//         .end((err, res) => {
//           expect(err, "Error occured.").to.be.null;
//           expect(
//             res,
//             `Status was not 200, was ${res.status} instead`
//           ).to.have.status(200);
//           expect(res.body, "Body was null.").to.not.be.null;
//           done();
//         });
//     });
//   });
// });

describe("Testing models", async function() {
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

    it("Save answer", async (done) => {
      const answer = new Answer();
      answer.answer = 'Answer1'
      answer.votes = 0;
      answer.pollId = '71f0f0fa-2cca-4658-8565-882970330967'

      answer.save();

      expect(Answer.findById(answer.answerId)).to.not.be.undefined;

      Answer.deleteOne({answerId: answer.answerId})

      done();
    })
  });

  describe("Testing Pollcontroller", async function() {

    it("Should retrieve a list of polls", async (done) => {

      var poll = new Poll();
      poll.name = "Testing Poll";
      poll.postId = "yhhwhbifhui14";
      poll.answersAmount = 4;
      poll.userid = "user_id2";

      poll.save();

      var poll1 = new Poll();
      poll1.name = "Test Poll";
      poll1.postId = "yhhwhbifhui";
      poll1.answersAmount = 4;
      poll1.userid = "user_id";

      poll1.save();

      expect(pollController.getPoll({limit: '15', skip: '0'})).to.not.be.undefined;

      Poll.deleteOne({pollId: poll.pollId })
      Poll.deleteOne({pollId: poll1.pollId })

      done();

    })

    it("Should create a new poll", async function (done) {
      var user = new User();
      user.local = {email: 'test_user', password:'test123'}
      user.role = 'user';
      user.userId = 'test_user_123'
      user.save();

      expect(User.findById('test_user_123')).to.not.be.undefined;

      var poll = new Poll();
      poll.name = "Testing Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;
      poll.userid = "user_id";

      var answers = ['answer1', 'answer2', 'answer3', 'answer4'];
      poll.answers = answers;

      expect(pollController.newPoll(poll, user)).should('succes');
      Poll.deleteOne({ pollId: poll.pollId });
      User.deleteOne({userId: user.id});

      done();
    });

    it("Should find poll based on UUID", async (done) => {
      var poll = new Poll();
      poll.name = "Test Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;
      poll.userid = "user_id";

      poll.save();
      
      expect(pollController.getPollByUUID(poll.pollId)).to.not.be.undefined;
      Poll.deleteOne({ pollId: poll.pollId });
      done();
    });

    it("Should find poll based on user", async (done) => {
      var poll = new Poll();
      poll.name = "Test Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;
      poll.userid = "user_id";

      poll.save();
      
      expect(pollController.getPollByUser(poll.user_id, poll.pollId)).to.not.be.undefined;
      Poll.deleteOne({ pollId: poll.pollId });
      done();
    });

    it("Should find polls based on user", async (done) => {
      var poll = new Poll();
      poll.name = "Test Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;
      poll.userid = "user_id";

      poll.save();
      
      expect(pollController.getPollsByUser(poll.user_id)).to.not.be.undefined;
      Poll.deleteOne({ pollId: poll.pollId });
      done();
    });

    it("Should find polls based on postId", async (done) => {
      var poll = new Poll();
      poll.name = "Test Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;
      poll.userid = "user_id";

      poll.save();
      
      expect(pollController.getPostPolls(poll.postId)).to.not.be.undefined;
      Poll.deleteOne({ pollId: poll.pollId });
      done();
    });

    it("Should get votes based on pollid", async (done) => {
      var poll = new Poll();
      poll.name = "Test Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;
      poll.userid = "user_id";

      poll.save();
      var response = pollController.getAnswer(poll.pollId)
      expect(response).to.not.be.undefined;
      
      Poll.deleteOne({ pollId: poll.pollId });
      done();
    });



  })

  describe("test polls", async function () {

    it("Saving a poll should not error", function (done) {
      var poll = new Poll();
      poll.name = "Testing Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;
      poll.userid = "user_id";

      poll.save();

      expect(Poll.findByUUID(poll.pollId)).to.not.be.undefined;
      expect(Poll.findByPost(poll.postId)).to.not.be.undefined;

      Poll.deleteOne({ pollId: poll.pollId });

      done();
    });

    it("should not error", function (done) {
      var poll = new Poll();
      poll.name = "Test Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;
      poll.userid = "user_id";

      var error = poll.validateSync();
      expect(error).to.be.undefined;
      done();
    });

    it("Poll cannot have more than 4 answers", async function () {
      var model = {
        name: "Test Poll",
        postId: "testid",
        userid: "user_id",
        answers: [
          new Answer({
            answer: "Answer 1",
            votes: 0,
            pollId: "71f0f0fa-2cca-4658-8565-882970330967",
          }),
          new Answer({
            answer: "Answer 2",
            votes: 0,
            pollId: "71f0f0fa-2cca-4658-8565-882970330967",
          }),
          new Answer({
            answer: "Answer 3",
            votes: 0,
            pollId: "71f0f0fa-2cca-4658-8565-882970330967",
          }),
          new Answer({
            answer: "Answer 4",
            votes: 0,
            pollId: "71f0f0fa-2cca-4658-8565-882970330967",
          }),
          new Answer({
            answer: "Answer 5",
            votes: 0,
            pollId: "71f0f0fa-2cca-4658-8565-882970330967",
          }),
        ],
      };

      var done = false;
      await Poll.create(model, function (err, poll) {
        if (err) {
          done = true;
        }
      });

      assert.ok(done, "Poll has no errors");
    });

    it('Get a poll by user', async (done) => {
      var poll = new Poll();
      poll.name = "Test Poll";
      poll.postId = "yhhwhbifhui";
      poll.answersAmount = 4;
      poll.userid = "user_id";

      poll.save();
      
      expect(pollController.getPollByUser(poll.userid, poll.pollId)).to.not.be.undefined;
      Poll.deleteOne({ pollId: poll.pollId });
      done();
    })
  });
  
  describe("test redditjs", function() {
    it("GetHomePage should not be null", function(done) {
      var homepageData = redditjs.getHomepage();
      expect(homepageData).to.not.be.undefined;
      done();
    });
  });

  describe("test poll controller", function () {
    it("GetPollByUser should be empty", function (done) {
      expect(pollController.getPollByUser("")).to.be.empty;
      done();
    });
  });
});

