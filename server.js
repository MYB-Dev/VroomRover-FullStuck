//* import libs
const express = require('express')
const WebSocket = require('ws')
const expressLayouts = require('express-ejs-layouts')
const passport = require('passport')
const cors = require('cors')
const helmet = require('helmet')
const flash = require('connect-flash')
const session = require('express-session')
const url = require('url')

//* env setup
require('dotenv').config()

//* import env variables
const PORT = process.env.PORT || 5000

//* Server setup
const app = express()
const server = require('http').createServer(app)

//* WebSockets setup
const wss = new WebSocket.Server({ port: 8080 })

//* Socket.io setup
require('./config/socket')(server, wss, {
  cors: {
    origin: '*',
  },
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`the server is listening on port ${PORT}`)
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
