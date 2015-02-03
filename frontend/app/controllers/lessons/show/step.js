import Ember from 'ember';
import AnimationMixin from '../../../mixins/animation';
import DemosRevolutionsView from '../../../views/demos/revolutions';
import DemosDerivativesView from '../../../views/demos/derivatives';
import DemosIntegralsView from '../../../views/demos/integrals';

//TODO: Fix the type system to be more readable
var LessonsShowStepController = Ember.ObjectController.extend(Ember.Evented, AnimationMixin, {
	needs: 'lessonsShow',
	lesson: Ember.computed.alias('controllers.lessonsShow'),
	init: function() {
		this._super();
	},
	setCurrentStep: function() {
		var orderNumber = this.get('model').get('orderNumber');
		this.get('lesson').set('currentStep', orderNumber);
	}.observes('orderNumber'),
	multipleChoice: function() {
		if(this.get('model').get('lessonStepType').get('typeNumber') === 1) {
			return true;
		} else {
			return false;
		}
	}.property('lessonStepType'),
	animation: function() {
		if(this.get('model').get('lessonStepType').get('typeNumber') === 2) {
			return true;
		} else {
			return false;
		}
	}.property('lessonStepType'),
	equation: function() {
		if(this.get('model').get('lessonStepType').get('typeNumber') === 3) {
			return true;
		} else {
			return false;
		}
	}.property('lessonStepType'),
	animationParams: function() {
		if(this.get('model').get('lessonStepType').get('typeNumber') === 2) {
			var params = {};
			var keys = this.get('model').get('animation').get('params').get('keys');
			var values = this.get('model').get('animation').get('params').get('values');
			for(var i=0; keys.get('length'); i++) {
				params[keys.objectAt(i)] = values.objectAt(i);
			}
			return params;
		} else {
			return {};
		}
	}.property('animation'),
	animationSpecialParams: function() {
		if(this.get('model').get('lessonStepType').get('typeNumber') === 2) {
			var specialParams = {};
			var keys = this.get('model').get('animation').get('specialParams').get('keys');
			var values = this.get('model').get('animation').get('specialParams').get('values');
			for(var i=0; keys.get('length'); i++) {
				specialParams[keys.objectAt(i)] = values.objectAt(i);
			}
			return specialParams;
		} else {
			return {};
		}
	}.property('animation'),
	animationType: function() {
		var animationType = this.get('model').get('lessonStepType').get('animationType');
		if(animationType === 1) {
			return DemosRevolutionsView;
		} else if(animationType === 2) {
			return DemosIntegralsView;
		} else if(animationType === 3) {
			return DemosDerivativesView;
		}
	}.property(),
	instructions: function() {
		var instructions = this.get('model').get('explanation').get('instructions');
		var orderedInstructions = new Array(instructions.get('length'));
		for(var i=0; i < orderedInstructions.length; i++) {
			orderedInstructions[instructions.objectAt(i).get('orderNumber')-1] = instructions.objectAt(i);
		}
		return orderedInstructions;
	}.property('explanation'),

	multipleChoiceQuestion: function() {
		var mcQuestion = this.get('model').get('multipleChoice').get('question');
		return mcQuestion;
	}.property('multipleChoice'),
	multipleChoiceAnswers: function() {
		var mcAnswers = this.get('model').get('multipleChoice').get('choices');
		var answerArr = new Array(mcAnswers.get('length'));
		for(var i = 0; i < mcAnswers.get('length'); i++) {
			answerArr[mcAnswers.objectAt(i).get('choiceId')-1] = mcAnswers.objectAt(i);
		}
		return answerArr;
	}.property('multipleChoice')
});

export default LessonsShowStepController;