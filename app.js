// Express and Route Related Imports
var express = require('express');
var bodyParser = require('body-parser');
var  router = express.Router();

// DB related Imports
// var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
// Models
var User = require('./models/user_model');
// DB URL
var url = "mongodb://localhost:27017/users";




// mongodb package way
// MongoClient.connect(url, function(err, db){
//   if (err) throw err;
//     console.log("Database Created!");
//     db.close();
//   });



// mongoose way
mongoose.connect( url );
mongoose.Promise = global.Promise; // ? Hmmm
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error:'));

db.once('open', function() {
  console.log("We did it, we create and connected to a MongoDB Database! ");
});


router.get('/', function(req, res){
  res.render('views/login', function(err, html){
    if (err){
      return next(err);
    }
    res.send(html);
  }
}

router.post('/', function(req, res){
  if (
    req.body.email &&
    req.body.password &&
    req.body.passwordConf){
      // get the new User's information from the request body
      var userDataToBePostedToDB = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      }

      User.create(userDataToBePostedToDB, function(err, user){
        if (err) {
          return next(err);
        } else {
          return res.redirect('/login'); // redirect to login view with some message to confirm that user was create successfully.
        }
      })


    }
})
