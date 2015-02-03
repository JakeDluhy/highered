var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var LessonStepSchema = new mongoose.Schema({
	orderNumber: {type: Number, required: true},
	lessonStepType: {
		typeNumber: {type: Number, required: true},
		animationType: {type: Number}
	},
	multipleChoice: {
		question: {type: String},
		choices: [{
			choiceId: {type: Number},
			content: {type: String},
			correctAnswer: {type: Boolean},
			answerResponse: {type: String}
		}]
	},
	animation: {
		params: {
			keys: {type: [String]},
			values: {type: [String]}
		},
		specialParams: {
			keys: {type: [String]},
			values: {type: [String]}
		}
	},
	equation: {type: ObjectId, ref: 'Equation'},
	explanation: {
		instructions: [{
			orderNumber: {type: Number},
			content: {type: String}
		}]
	}
});

module.exports = LessonStepSchema;