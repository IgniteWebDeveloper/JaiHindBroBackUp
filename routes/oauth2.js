const googleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const passport =require("passport");
const User=require('./users')
require('dotenv').config();
// google oauth2 

passport.use(new googleStrategy({
    clientID: process.env.GOOGLECLIENTID,
    clientSecret: process.env.GOOGLECLIENTSECRET,
    callbackURL: process.env.GOOGLECALLBACK
  },
  function (accessToken, refreshToken, profile, done) {
    //  console.log(profile); //profile contains all the personal data returned 
    // done(null, profile)
    User.findOne({
      email: profile.emails[0].value 
  }
  , function(err, user) {
      if (err) {
          return done(err);
      }
      //No user was found... so create a new user with values from Facebook (all the profile. stuff)
      if (!user) {
          user = new User({
              userid:profile.id,
              fullname: profile.displayName,
              email: profile.emails[0].value,
          });
          user.save(function(err) {
              if (err) console.log(err);
              return done(err, user);
          });
      } else {
          //found user. Return
          return done(err, user);
      }
  });
      }
  ));

  
  // facebook oauth2 

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOKCLIENTID,
    clientSecret: process.env.FACEBOOKCLIENTSECRET,
    callbackURL: process.env.FACEBOOKCALLBACK
},
function(accessToken, refreshToken, profile, done) {
    //check user table for anyone with a facebook ID of profile.id
    console.log(profile)
    User.findOne({
        userid:profile.id
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
            user = new User({
              userid:profile.id,
              fullname: profile.displayName,
            //   email: profile.emails[0].value,
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            //found user. Return
            return done(err, user);
        }
    });
}
));


 
