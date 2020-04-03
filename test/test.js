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
});

