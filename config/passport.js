const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {

  // Local Strategy

  passport.use(new LocalStrategy( (username, password, done) => {

    //Match UserName

    let query = {
      username: username
    };

    User.findOne(query, (err, user) => {

      if (err) {
        console.log(err)
      }
      if (!user) {
        return done(null, false, {message: "User Not Found"})
      }

      bcrypt.compare(password, user.password, function(err, isMatch) {

        if (err) {
          console.log(err)
        }
        if (isMatch) {
          return done(null, user)

        } else {
          return done(null, false, {message: "Password Did Not Match"})
        }
      })
    });


  })


)


};


passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
