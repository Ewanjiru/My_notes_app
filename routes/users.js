const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const router = express.Router();

//load user model
require('../models/User');
const User = mongoose.model('users');

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  console.log('was called', req.body);
  passport.authenticate(`local`, {
    successRedirect: '/notes',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'That email address is already in use')
          res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
          })
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash('success_msg', 'Successfully registered');
                  res.redirect('/users/login')
                })
                .catch(error => console.log(error));
            })
          });
        }
      })
  }
});

//logout user
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You were logged out')
  res.redirect('/users/login')
});

module.exports = router;