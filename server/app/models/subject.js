var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.Types.ObjectId;

var SubjectSchema = new Schema({
	title: {type: String, required: true},
	sections: [{
		title: {type: String, required: true}
	}]
});

var Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;