const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const User = require('./User')
const Trip = require('./Trip')
var users = []
var session = require('express-session')

//setting up the middleware for the session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

//setting up the body parser to use URL encoded
app.use(bodyParser.urlencoded({ extended: false}))

// setting the templating engine to use mustache
app.engine('mustache',mustacheExpress())

// setting the mustache pages directory
app.set('views','./views')

// set the view engine to mustache
app.set('view engine','mustache')

//load the index mustache page
app.get('/', function(req, res) {
  res.render('index')
})

//get the form data from the index/registation page
app.post('/register', function(req, res) {
  let username = req.body.username
  let password = req.body.password

  let user = new User(username, password)

  //now put users in an array which is serving as our database

  users.push(user)

  res.redirect('/login')
})

//now I am creating the route to the login page

app.get('/login', function(req, res) {
  res.render('login')
})
  // after login the user is redirected to the trips page
app.post('/login', function(req, res) {
  let username = req.body.username
  let password = req.body.password

//finding the user in the users array
  let user = users.find(function(user) {
    return user.username == username && user.password == password
  })

//keeping the session going for this user
  if (req.session) {
    req.session.user = user
  }

  res.redirect('/trips')
})

app.get('/trips', function(req, res) {
  //res.render('trips', {trips:req.session.user.trips})
  //sending a user object instead of Trips
  res.render('trips', {user: req.session.user})
})

app.post('/trips', function(req, res) {
  let name = req.body.name
  let imageURL = req.body.imageURL

  //setting up the trip object
  let trip = new Trip(name, imageURL)

  //setting up the user session
  let user = req.session.user
  //push the trips for this particular user into the trips array??
  user.trips.push(trip)

  res.redirect('/trips')
})





app.listen(3000, () => console.log('THE SERVER IS LISTENING!!'))
