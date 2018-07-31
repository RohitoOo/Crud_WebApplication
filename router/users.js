const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

let User = require('../models/user');

//Register Form

router.get('/register', (req, res) => {

  res.render('register')

});

// Loging form
router.get('/login', (req, res) => {
  res.render('login')

})

// Login Process Execution

router.post('/login', (req, res, next) => {

  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);

})

// Add User Route

router.post('/add', (req, res) => {

  let newUser = new User();

  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.username = req.body.username;
  newUser.password = req.body.password;

  bcrypt.genSalt(10, (err, salt) => {

    bcrypt.hash(newUser.password, salt, (err, hash) => {

      if (err) {
        console.log(err)
      }
      newUser.password = hash;
      // Password converted to Hash

      // Ready to save to Database
      newUser.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          req.flash('success', 'User Registered')
          res.redirect('login')
        }
      })

    });
  })

})

// Logout Route

router.get('/logout', (req, res) => {

  req.logout();
  res.redirect('login')

});

module.exports = router;
