var mongoose = require("mongoose");
var uuid = require("uuid");
var Vote = require('./poll.answer.vote');

var answerSchema = mongoose.Schema({
  answerId: {
    type: String,
    default: function genUUID() {
      return uuid.v4();
    },
    required: true
  },
  answer: {
    type: String,
    required: true,
    maxlength: "200"
  },
  votes: {
    type: [Vote.schema],
    required: false
  },
  pollId: {
    type: String,
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length == 36;
      },
      message: "The UUID is not of the right length"
    },
    ref: "Poll"
  }
});

module.exports = mongoose.model("Answer", answerSchema);
