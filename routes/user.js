const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../config/dataBase')
const passport = require('passport')

//* Login Page

router.get('/login', (req, res) => {
  res.render('login')
})

// Register Page
router.get('/register', (req, res) => res.render('register'))

// Register
router.post('/register', (req, res) => {
  const { username, password, password2 } = req.body
  let errors = []

  if (!username || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' })
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' })
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' })
  }

  if (errors.length > 0) {
    console.log(errors)
    res.render('register', {
      errors,
      username,
      password,
      password2,
    })
  } else {
    db.findOne({ username: username }, (err, user) => {
      if (user) {
        errors.push({ msg: 'Username already exists' })
        res.render('register', {
          errors,
          username,
          password,
          password2,
        })
      } else {
        const newUser = {
          username,
          password,
        }

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            db.insert(newUser, (err) => {
              req.flash('success_msg', 'You are now registered and can log in')
              res.redirect('/user/login')
            })
          })
        })
      }
    })
  }
})

//* Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true,
  })(req, res, next)
})

//* Logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/user/login')
})

module.exports = router
