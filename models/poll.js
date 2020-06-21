var mongoose = require('mongoose');
var uuid = require("uuid");
var Answer = require('./answer');

var pollSchema = mongoose.Schema({
  pollId: {
    type: String,
    default: function genUUID() {
      return uuid.v4();
    }
  },
  name: {
    type: String,
    required: true
  },
  postId: {
    type: String,
    required: true
  },
  answers: [Answer.schema],
  userid: {
    type: String,
    required: true
  }
});

pollSchema.statics.findByUUID = function(uuid){
  return this.find({pollId: uuid});
}

pollSchema.statics.findByPost = function(_postId){
  return this.find({postId: _postId});
}

pollSchema.methods.getVotes = function(){
  var votes = 0;
  var answers = Answer.find({pollId: this.pollId});
  for(var i = 0; i < answers.length; i++){
    votes += answers[i].votes;
  }
  return votes;
}

module.exports = mongoose.model('Poll', pollSchema);