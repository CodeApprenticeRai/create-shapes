// Express Route, Sessions Related Imports
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var  router = express.Router();
const app = express();

//


// Set the template engine to just accept basic html for now
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use( '/static', express.static( path.join(__dirname, 'public') ) );

// use bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// app.use(function (req, res) {
//   res.setHeader('Content-Type', 'text/plain')
//   res.write('you posted:\n')
//   res.end(JSON.stringify(req.body, null, 2))
// });


// DB related Imports
// var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
// Models
var User = require('./models/user_model');
// DB URL
var url = "mongodb://localhost:27017/users";


// console.log("I made a change.");

// mongodb package way
// MongoClient.connect(url, function(err, db){
//   if (err) throw err;
//     console.log("Database Created!");
//     db.close();
//   });

// sessions middleware for creating persistent user auth
app.use( session({
  secret: 'what is this?',
  resave: true,
  saveUninitialized: false,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


// mongoose way
mongoose.connect( url );
mongoose.Promise = global.Promise; // ? Hmmm
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error:'));

db.once('open', function() {
  console.log("We changed something in the database! ");
});



// some two.js drawing Considerations





///express router to handle requests
app.get('/', function(req, res, next){
  res.render('index', {}, function(err, html){
    if (err){
      return next(err);
    }
    res.send(html);
  });
});


app.get('/login', function(req, res, next){
  res.render('login', { badLogin: false , signUpConf: false }, function(err, html){
    if (err){
      return next(err);
    }
    res.send(html);
  })
})

// UserSchema.statics.authenticate = function( username, password, callback){
//   User.findOne( {email: email} )
//     .exec( (err, user) => {
//       if (err){
//         return callback(err)
//       } else if (!user) {
//         var err = new Error('User not found.');
//         err.status = 401;
//         return callback(err);
//       }
//       bcrypt.compare(password, user.password, function(err, result){
//         if (result === true ){
//           return callback(null, user);
//         } else {
//           return callback();
//         }
//       });
//     });
// };

app.post('/', function(req, res, next){
  if ( req.session && req.session.user){ // if there's a session cookie, and it contains user
    User.findOne(
      { username: req.session.user.username },
      function( err, user){
        if (!user){
          // if the user is not found ( case where session times )
          req.session.reload();
          return res.render('index', {} );
        }
      }
    )
  }
  if (
    req.body.username &&
    req.body.password ){
      // // securely check to see if the user, pass pair exists in db
      User.findOne(
        { username: req.body.username },
        function (err, user){
          if (err) throw err;
          if (user == null ){
            return res.render('login', { badLogin: true, signUpConf: false } );
          }

          user.comparePassword(req.body.password, function(err, isMatch){
            if (err) throw err;
            if ( isMatch ){
              req.session.user = user; // hmmm @ scope
              res.render('index', { "user": user }, function(err, html){
                if (err){
                  return next(err);
                }
                res.send(html);
              })
            } else  {
              return res.render('login', { badLogin: true, signUpConf: false } );
            }
          });
      });
    }
});

app.get('/sign_up', function(req, res, next){
    res.render('sign_up', function(err, html){
      if (err){
        return next(err);
      }
      res.send(html);
    });
});

app.post('/sign_up', function(req, res, next){
  console.log("Recieved Form Data... Trying to process it. ");
  console.log("Here is the request body: ");

  console.log(req.body)

  if (
    req.body.email &&
    req.body.password &&
    req.body.passwordConf){
      // get the new User's information from the request body
      console.log("Making a little progress.");
      var userDataToBePostedToDB = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      }
      console.log("Almost done.");
      User.create(userDataToBePostedToDB, function(err, user){
        if (err) {
          return next(err);
        } else {
          console.log("Done!");
          return res.render('login', { signUpConf: true, badLogin: false } ); // redirect to login view with some message to confirm that user was create successfully.
        }
      })


    }
});

app.listen(3000, () => "Up and running!\nListening for requests.\nYour wish is my command Sensei.");
