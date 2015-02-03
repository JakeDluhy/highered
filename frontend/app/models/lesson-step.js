import DS from 'ember-data';

var LessonStep = DS.Model.extend({
	orderNumber: DS.attr('number'),
	lesson: DS.belongsTo('lesson'),
	lessonStepType: DS.hasOneFragment('lessonStepType'),
	multipleChoice: DS.hasOneFragment('multipleChoice'),
	animation: DS.hasOneFragment('animation'),
	explanation: DS.hasOneFragment('explanation'),
	stepUrl: function() {
		var typeNumber = this.get('lessonStepType').get('typeNumber');
		var animationType = this.get('lessonStepType').get('animationType');
		if(typeNumber === 1) {
			return '/images/multipleChoice.png';
		} else if (typeNumber === 2) {
			if(animationType === 1) {
				return '/images/derivativesStep.png';
			} else if(animationType === 2) {
				return '/images/integralsStep.png';
			} else if(animationType === 3) {
				return '/images/revolutionsStep.png';
			} else {
				//TODO: Set else
			}
		} else if(typeNumber === 3){
			return '/images/equationStep.png';
		} else {
			//TODO: Set else
		}
	}.property('lessonStepType')
});

export default LessonStep;