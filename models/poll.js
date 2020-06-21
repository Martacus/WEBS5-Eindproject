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
  answers: {
    type: [Answer.schema],
    validate: [arrayValidate, "Exceeds the maximum amount of answers"]
  },
  userid: {
    type: String,
    required: true,
    validate: [checkPolls, "Can only create one poll per user!"]
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

function arrayValidate(array) {
  return array.length <= 4;
}

function checkPolls() {
  var posts = findByPost(this.postId);
  if(posts.length > 1){
    return false;
  } else {
    return true;
  }
}


module.exports = mongoose.model('Poll', pollSchema);