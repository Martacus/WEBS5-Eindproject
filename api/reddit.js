const https = require("https");
const fetch = require("node-fetch");
const homePageURL = "https://www.reddit.com/.json"; 


module.exports.getHomepage = async function() {
  try {
    const response = await fetch(homePageURL);
    const json = await response.json();
    return frontPageToPosts(json);
  } catch (error) {
    console.log(error);
  }
};

module.exports.getPost = async function(postName){
  try{
    const apiURL = 'https://api.reddit.com/api/info/?id=' + postName;
    const response = await fetch(apiURL);
    const json = await response.json();
    return getPostData(json);
  } catch(error) {
    console.log(error);
  }
}

function frontPageToPosts(data){
  var postarray = [];
  var childrenArray =  data['data']['children'];
  for (index = 0; index < childrenArray.length; index++) {
    var dataObject = childrenArray[index]["data"];

    var returnObject = {};
    returnObject.subreddit =  dataObject['subreddit'];
    returnObject.title =  dataObject['title'];
    returnObject.url = dataObject['url'];
    returnObject.id = dataObject['id'];
    returnObject.name = dataObject['name'];

    postarray.push(returnObject);
  }
  return postarray;
}

function getPostData(data){
  var post = {};
  var childrenArray = data['data']['children'];
  var dataObject = childrenArray[0]["data"];
  post.subreddit = dataObject['subreddit'];
  post.title = dataObject['title'];
  post.url = dataObject['url'];
  post.id = dataObject['id'];
  post.name = dataObject['name'];

  return post;
}