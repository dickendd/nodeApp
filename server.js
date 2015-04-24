// server.js

// BASE SETUP
// ===================================================

// call the packages we need
var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();

var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Bear = require('./app/models/bear');
var User = require('./app/models/user');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

// config files
var db = require('./config/db');
var auth = require('./config/auth');

var port = process.env.PORT || 8080;

mongoose.connect(db.url); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
// parse application/vnd.api+json as json
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


var expressJwt = require('express-jwt');

app.use('/me', expressJwt({secret: auth.secret}));

// ROUTES FOR API
// ==================================================
require('./app/routes')(app, auth); // configure our routes

var options = {
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.crt')
};

process.on('uncaughtException', function(err) {
	console.log('Uncaught Exception');
    console.log(err);
});

// START THE SERVER
// =================================================
http.createServer(app).listen(port);
https.createServer(options, app).listen(8443);
console.log('Shit happens on port ' + port);
console.log('Secure shit happens on port 8443');

// expose app           
exports = module.exports = app; 
