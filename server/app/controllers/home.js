var User = require('../models/user');

module.exports = {
  index: function(req, res) {
    res.render('layouts/index');
    console.log('Here');
  },
  signup: function(req, res) {
    var newUser = new User(req.body);
    newUser.save(function(err, user) {
      if (err) {
        console.log(err);
        res.json({error: 'Error creating new User'});
      } else {
        res.json({ user: user });
      }
    });
  },
  login: function(req, res) {
    var data = req.body;
    User.attemptLogin(data.email, data.password, function(err, user, errMessage) {
      if(err) {
        res.json({error: errMessage});
      } else {
        res.json({user: user});
      }
    });
  },
  saveRemember: function(req, res) {
    var rememberToken = req.body.rememberToken;
    var user = req.body.user;
    console.log(user);
    User.findById(user._id, function(err, user) {
      if(err) {
        console.log(err);
        res.json({error: err});
      } else {
        user.saveRememberToken(rememberToken, function(err, user) {
          if(err) {
            res.json({result: err});
          } else {
            res.json({encryptedId: user.encryptedId});
          }
        });
      }
    });
  },
  checkRemember: function(req, res) {
    var rememberToken = req.body.rememberToken;
    var encryptedId = req.body.encryptedId;
    User.findByEncryptedId(encryptedId, function(err, user) {
      if(err) {
        console.log(err);
        res.json({error: err});
      } else {
        user.checkRememberToken(rememberToken, function(err, isMatch) {
          if(err) {
            res.json({result: err});
          } else if(isMatch) {
            res.json({user: user});
          } else {
            res.json({result: 'Remember Token does not match'});
          }
        });
      }
    });
  }
};