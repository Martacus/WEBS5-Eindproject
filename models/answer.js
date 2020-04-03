var mongoose = require("mongoose");
var uuid = require("uuid");
//uuid.v4();

var answerSchema = mongoose.Schema({
  answerId: {
    type: String,
    default: function genUUID() {
      return uuid.v4();
    }
  },
  answer: String,
  votes: {
    type: Number,
    min: 0,
    default: 0
  },
  pollId: String,
  userId: String
});

module.exports = mongoose.model("Answer", answerSchema);
