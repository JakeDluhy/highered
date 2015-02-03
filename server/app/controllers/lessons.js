var Lesson = require('../models/lesson');

module.exports = {
  index: function(req, res) {
    Lesson.find().lean().select('-__v').exec(function(err, lessons) {
    	res.json({lessons: lessons});
    });
  },
  create: function(req, res) {
  	var newLesson = new Lesson(req.body.lesson);
    newLesson.save(function(err, lesson) {
      if (err) {
      	console.log(err);
        res.json({error: 'Error adding Lesson.'});
      } else {
        res.json({lesson: lesson});
      }
    });
  },
  show: function(req, res) {
  	Lesson.findById(req.params.id).lean().select('-__v').exec(function(err, lesson) {
      if(err) {
        res.json({error: 'Lesson not found'});
        console.log(err);
      } else if(lesson) {
        res.json({lesson: lesson});
      } else {
        res.json({error: 'Lesson not found'});
      }
    });
  }
};