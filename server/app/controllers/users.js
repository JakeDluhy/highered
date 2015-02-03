var User = require('../models/user');

module.exports = {
  index: function(req, res) {
   	User.find().lean().select('-__v').exec(function(err, users) {
    	res.json({users: users});
    });
  },
  show: function(req, res) {
  	User.findById(req.params.id).lean().select('-__v -password').exec(function(err, user) {
      if(err) {
        res.json({error: 'User not found'});
        console.log(err);
      } else if(user) {
        res.json({user: user});
      } else {
        res.json({error: 'User not found'});
      }
    });
  }
};

// index: function(req, res) {
//         var data = models.Post.find().lean().select('-__v').exec(function(err, data) {
//             res.json({posts: data});
//         });
//     },]getById: function(req, res) {
//         models.Post.find({ _id: req.params.id }, function(err, post) {
//             if (err) {
//                 res.json({error: 'Post not found.'});
//             } else {
//                 res.json({posts: post});
//             }
//         });