var mongoose = require("mongoose");
var uuid = require("uuid");

var voteSchema = mongoose.Schema({
  voteId: {
    type: String,
    default: function genUUID() {
      return uuid.v4();
    },
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  dateOfVote: {
    type: Date,
    default: () => Date.now()
  }
});

module.exports = mongoose.model("Vote", voteSchema);
