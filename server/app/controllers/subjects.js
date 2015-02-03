var Subject = require('../models/subject');

module.exports = {
  index: function(req, res) {
   	Subject.find().lean().select('-__v').exec(function(err, subjects) {
    	res.json({subject: subjects});
    });
  },
  show: function(req, res) {
  	Subject.findById(req.params.id).lean().select('__v').exec(function(err, subject) {
      if(err) {
        res.json({error: 'Subject not found'});
        console.log(err);
      } else if(subject) {
        res.json({subject: subject});
      } else {
        res.json({error: 'Subject not found'});
      }
    });
  }
};