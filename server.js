//* import libs
const express = require('express')
const WebSocket = require('ws')
const expressLayouts = require('express-ejs-layouts')
const passport = require('passport')
const cors = require('cors')
const helmet = require('helmet')
const flash = require('connect-flash')
const session = require('express-session')

//* import env variables
const PORT = process.env.PORT || 5000

//* Server setup
const app = express()
const server = require('http').createServer(app)

server.listen(PORT, () => {
  console.log(`the server is listening on port ${PORT}`)
})

const wss = new WebSocket.Server({ port: 1337 })

//* Socket setup
require('./config/socket')(server, wss, {
  cors: {
    origin: '*',
  },
})

//* Passport Config
require('./config/passport')(passport)

//* Create dataBase
const db = require('./config/dataBase')

//* Load dataBase
db.loadDatabase()

//* EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//* Static folder
app.use(express.static('public'))

//* BodyParser middleware
app.use(express.urlencoded({ extended: true }))

//* Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)

//* Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//* Connect flash
app.use(flash())

app.use(cors())
app.use(helmet({ contentSecurityPolicy: false }))

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

//* Routes
app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user'))
