// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
  facebookAuth: {
    clientID: "505812516767522", // your App ID
    clientSecret: "b384cd54148bf584fd8bf4c8de5e86c4", // your App Secret
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileURL:
      "https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email",
    profileFields: ["id", "email", "name"] // For requesting permissions from Facebook API
  },

  twitterAuth: {
    consumerKey: "your-consumer-key-here",
    consumerSecret: "your-client-secret-here",
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },

  googleAuth: {
    clientID: "782386366890-dbu19jq7q3klcplehfqqqb8b540d8muo.apps.googleusercontent.com",
    clientSecret: "mqcoXfaheUH7h0i4jr3tC2Uq",
    callbackURL: "http://localhost:3000/auth/google/callback"
  }
};
