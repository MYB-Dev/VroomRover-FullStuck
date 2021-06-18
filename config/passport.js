const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

//* Load db
const db = require('./dataBase')

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username' },
      (username, password, done) => {
        // Match user
        db.findOne({ username: username }, (err, user) => {
          if (!user) {
            return done(null, false, {
              message: 'That username is not registered',
            })
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err
            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'Password incorrect' })
            }
          })
        })
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    db.findOne({ _id: id }, (err, user) => {
      done(err, user)
    })
  })
}
