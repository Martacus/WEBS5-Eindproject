var Poll = require("../models/poll");
var Answer = require("../models/poll.answer");
var Vote = require("../models/poll.answer.vote");
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
  await Poll.find({ pollId: query.pollId }, function(err, doc) {
    console.log(query)
    if (doc.length) {
      answer = Answer.find({ answerId: query.answerId });
    } else {
      answer = {};
    }
  });
  return answer;
};

module.exports.addVotes = async function(query){
  var pollArray = await Poll.find({pollId: query.params.pollid});
  var poll = pollArray[0];
  console.log( query.user)
  if(poll != undefined && poll.answers != undefined){
    console.log("komt")
    poll.answers.forEach(function(s){
      if(s.answerId == query.params.answerid){
        var vote = new Vote();
        vote.userId = query.user._id;
        s.votes.push(vote);
        vote.save();
        poll.save();
      }
    })
  }
  return { error: "Poll not found" };
}

module.exports.getVotes = async function(query) {
  var pollArray = await Poll.find({pollId: query.pollId});
  var poll = pollArray[0];
  var votes = {};
  if(poll != undefined && poll.answers != undefined){
    poll.answers.forEach(function(s){
      if(s.answerId == query.answerId){
        votes = s.votes;
      }
    })
  }
  return votes;
}

module.exports.getVote = async function(query) {
  var pollArray = await Poll.find({pollId: query.pollId});
  var poll = pollArray[0];
  var foundVote = {};
  if(poll != undefined && poll.answers != undefined){
    poll.answers.forEach(function(s){
      if(s.answerId == query.answerId){
        s.votes.forEach(function(vote){
          if(vote.voteId == query.voteId){
            foundVote = vote
          }
        })
      }
    })
  }
  return foundVote;
}