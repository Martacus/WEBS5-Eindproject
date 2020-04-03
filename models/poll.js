var mongoose = require('mongoose');
var uuid = require("uuid");
//uuid.v4();


var pollSchema = mongoose.Schema({
  pollId: {
    type: String,
    default: function genUUID() {
      return uuid.v4();
    }
  },
  name: String,
  postId: String,
  answersAmount: Number
});

pollSchema.statics.findByUUID = function(uuid){
  return this.find({pollId: uuid});
}

pollSchema.statics.findByPost = function(_postId){
  return this.find({postId: _postId});
}

module.exports = mongoose.model('Poll', pollSchema);