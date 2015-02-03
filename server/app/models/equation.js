var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.Types.ObjectId;

var EquationSchema = new Schema({
	name: {type: String, required: true},
	parts: [{
		content: {type: String, required: true},
		explanation: {type: String}
	}]
});

var Equation = mongoose.model('Equation', EquationSchema);

module.exports = Equation;