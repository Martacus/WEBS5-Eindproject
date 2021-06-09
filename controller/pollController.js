var Poll = require("../models/poll");
var Answer = require("../models/poll.answer");
const { use } = require("chai");

module.exports.newPoll = async function(data, user, callback){
  var poll = new Poll();
  poll.name = data.name;
  poll.postId = data.postId;
  poll.userid = user._id;

  var culledAnswers = [];
  data.answers.forEach(answer => {
    if(answer !== ''){
      culledAnswers.push(answer);
    }
  })

  var answerArray = [];
  for (var i = 0; i < culledAnswers.length; i++) {
    var answer = new Answer();
    answer.answer = culledAnswers[i];
    answerArray.push(answer);
  }

  poll.answersAmount = culledAnswers.length;
  poll.answers = answerArray;

  poll.save(function(err) {
    if (err) throw err;
  });

  poll.answers.forEach(answer => {
    answer.pollId = poll.pollId;
    answer.save({ suppressWarning: true },function (err) {
      if (err) throw err;
    });
  })
}

getLimit = function(params){
  const limit = parseInt(params.limit);
  delete params.skip;
  if(limit = undefined){
    return 20;
  }
  return limit;
}

getSkip = function(params){
  const skip = parseInt(params.skip);
  delete params.limit;
  if(skip == undefined){
    return 0;
  }
  return skip;
}

module.exports.getPoll = async function(params) {
  const skip = getSkip(params);
  const limit = getLimit(params);

  return await Poll.find(params).skip(skip).limit(limit);
};

module.exports.getPollByUUID = async function(uuid){
  return await Poll.findByUUID(uuid);
}

module.exports.getPostPolls = async function(postId){
  return await Poll.findByPost(postId);
}

module.exports.getPollByUser = async function(userId, pollId){
  return await Poll.findOne({ pollId: pollId, userid: userId });
}

module.exports.getPollsByUser = async function (userId) {
  return await Poll.find({ userid: userId});
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

module.exports.getVotes = async function(pollId) {
  var poll = await Poll.find({pollId: query.pollId});
  return { votes: poll.getVotes() };
}