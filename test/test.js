var chai = require("chai");
var expect = require('chai').expect;
var should = require('chai').should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
var request = require('supertest')

//Models
var User = require('../models/user');
var Answer = require('../models/poll.answer');
var Poll = require('../models/poll');

//Reddit.js
var redditjs = require('../api/reddit');

//Controllers
var pollController = require('../controller/pollController');

var app = require("../app")
require("../config/passport")(passport);


// load our routes and pass in our app and fully configured passport
require('../routes/routes.js')(app, passport); 

  describe("Checking modules", async () => {
    it("Poll module should not be undefined", () => {
      expect(Poll).to.not.be.undefined;
    })
    it('User module should not be undefined', () => {
      expect(User).to.not.be.undefined;
    });
  
    it('Answer module should not be undefined', () => {
      expect(Answer).to.not.be.undefined;
    });
  })

  describe('Checking reddit api', async function(){
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

describe("Checking models", async function() {
  describe("Answer model:", function() {
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

  it("Should create a new poll", async (done) => {
    var user = new User();
    user.local = {email: 'test_user', password:'test123'}
    user.role = 'user';
    user.userId = 'test_user_123'
    user.save();

    expect(User.findById('test_user_123')).to.not.be.undefined;

    var poll = new Poll();
    poll.pollId = "71f0f0fa-2cca-4658-8565-8829";
    poll.name = "Testing Poll";
    poll.postId = "yhhwhbifhui";
    poll.answersAmount = 4;
    poll.userid = "user_id";
    poll.answers = [];

    for(let i = 0; i < 4; i++) {
      var answer = new Answer();
      answer.answer = 'Answer1'
      answer.votes = 0;
      answer.pollId = '71f0f0fa-2cca-4658-8565-8829'
      poll.answers.push(answer);
    }
  
    pollController.newPoll(poll, user);
    expect(pollController.getPollByUUID({pollId: poll.pollId})).to.not.be.undefined;
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

  it("Should error when more than 5 answers are given", async () => {
    var poll = new Poll();
    poll.pollId = "71f0f0fa-2cca-4658-8565-8829";
    poll.name = "Testing Poll";
    poll.postId = "yhhwhbifhui";
    poll.answersAmount = 4;
    poll.userid = "user_id";
    poll.answers = [];

    for(let i = 0; i < 5; i++) {
      var answer = new Answer();
      answer.answer = 'Answer1'
      answer.votes = 0;
      answer.pollId = '71f0f0fa-2cca-4658-8565-8829'
      poll.answers.push(answer);
    }

    poll.save();
    
    return pollController.getPollByUUID(poll.pollId).then((data) => {
      expect(data).to.be.not.undefined;
      expect(data).to.be.instanceOf(Array);
      expect(data).to.have.length(0);
  })
})

  //poll can't have more than 4 answers.
  it("Should get answers based on pollid", async (done) => {
    var poll = new Poll();
    poll.name = "Test Poll";
    poll.postId = "yhhwhbifhui";
    poll.answersAmount = 4;
    poll.userid = "user_id";
    poll.answers = [];

    var answer = new Answer();
    answer.answer = 'Answer1'
    answer.votes = 0;
    answer.pollId = '71f0f0fa-2cca-4658-8565-8829'
    poll.answers.push(answer);

    poll.save();
    var response = pollController.getAnswer({pollId: poll.pollId, answerId: answer.answerId })
    expect(response).to.not.be.undefined;
    
    Poll.deleteOne({ pollId: poll.pollId });
    done();
  });

  // describe("POST /login", () => {
  //   before(function(done) {
  //     var user = new User();
  //     user.local = {email: 'cringer@test.nl', password:'test123'}
  //     user.role = 'user';
  //     user.userId = 'test'
  //     user.save(done);
  //   })
  //   it("Route '/signup' should return a page", function (done) {
  //     request(app)
  //       .get("/signup")
  //       .set("type", "json")
  //       .end((err, res) => {
  //         expect(err, "Error occured.").to.be.null;
  //         expect(
  //           res,
  //           `Status was not 200, was ${res.status} instead`
  //         ).to.have.status(200);
  //         expect(res.body, "Body was null.").to.not.be.null;
  //         done();
  //       });
  //   });
  //   it("It should login succesfully", (done) => {
  //     chai.request(app)
  //     .post("/login")
  //     .field("email", "akshay@akshay.nl")
  //     .field("password", "akshay")
  //     .end((err, response) => {
  //       response.should.have.status(200);
  //     })
  //     done();
  //   })
  // })
})