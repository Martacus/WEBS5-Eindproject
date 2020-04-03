var Poll = require("../models/poll");
var Answer = require("../models/answer");

module.exports.newPoll = function(data){
  var poll = new Poll();
  poll.name = data.name;
  poll.postId = data.postId;
  poll.answersAmount = data.answersAmount;
  poll.answers = data.answers;

  poll.save(function(err) {
    if (err) throw err;
  });

  for(var i = 0; i < poll.answersAmount; i++){
    var answer = new Answer();
    answer.pollId = poll.pollId;
    answer.answer = poll.answers[i];

    answer.save(function(err) {
      if (err) throw err;
    });
  }

}

module.exports.getPoll = async function(params) {
  return await Poll.find(params);
};

module.exports.getPollByUUID = async function(uuid){
  return await Poll.findByUUID(uuid);
}

module.exports.getPostPolls = async function(postId){
  return await Poll.findByPost(postId);
}

module.exports.getAnswer = async function(query) {
  var answer = {};
  await Poll.find({ pollId: query.pollId }, function(err, doc) {
    if (doc.length) {
      answer = Answer.find({ answerId: query.answerId });
    } else {
      answer = {};
    }
  });
  return answer;
};