var mongoose = require('mongoose');
var bcryt = require('bcrypt');


var UserSchema = new mongoose.Schema({

  email : {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },

  username : {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },

  password : {
    type: String,
    required: true,
  },

  passwordConf : {
    type: String,
    required: true,
  }
});

UserSchema.pre('save', function(next) ){ // wtf is with these next functions ... I hope this wont become a problem
  var user = this;
  bycrpt.hash(user.password, 10, function( err, hash){
    if (err){
      return next(err);
    } else {
      user.password = hash;
      next();
    }
  })
}

var User = mongoose.model('User', UserSchema);
module.exports = User;
