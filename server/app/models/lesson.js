var mongoose = require('mongoose'),
	LessonStepSchema = require('./lessonStepSchema'),
	User = require('./user'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var Lesson;

var LessonSchema = new Schema({
  title: {type: String, required: true},
  author: {type: ObjectId, ref: 'User', required: true},
  updatedAt: {type: Date},
  lessonSteps: [LessonStepSchema]
});

//Pre save
//Set updated at flag
LessonSchema.pre('save', function(next) {
	this.updatedAt = Date.now();
	next();
});

LessonSchema.post('save', function(next) {
	var id = String(this.author);
	var self = this;
	User.findById(id).exec(function(err, user) {
		if (err) {throw err;}
		user.lessons.push(self._id);
		user.save(function(err) {
			if(err) {throw err;}
		});
	});
});

Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;