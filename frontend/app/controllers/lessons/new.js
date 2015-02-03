import Ember from 'ember';

var LessonsNewController = Ember.ObjectController.extend({
	// currentStep: 0,
	author: function() {
		return this.get('model').get('author');
	}.property('author'),
	title: function() {
		return this.get('model').get('title');
	}.property('title'),
	steps: function() {
		var lessonSteps = this.get('model').get('lessonSteps');
		var steps = new Array(lessonSteps.get('length'));
		for(var i=0; i < steps.length; i++) {
			steps[lessonSteps.objectAt(i).get('orderNumber')-1] = lessonSteps.objectAt(i);
		}
		return steps;
	}.property('steps'),
	setTitle: function(title) {
		this.get('model').set('title', title);
	}
	// actions: {
	// 	previousStep: function() {
	// 		console.log(this.get('currentStep'));
	// 		var steps = this.get('steps');
	// 		var currentStep = this.get('currentStep');
	// 		var stepsIndex = currentStep - 1;
	// 		if(currentStep === 0) {
	// 			console.log('0 step');
	// 		} else if(currentStep === 1) {
	// 			this.transitionToRoute('lessons.show');
	// 			this.set('currentStep', 0);
	// 		} else {
	// 			this.transitionToRoute('lessons.show.step', steps.objectAt(stepsIndex-1));
	// 			this.set('currentStep', currentStep-1);
	// 		}
	// 	},
	// 	nextStep: function() {
	// 		console.log(this.get('currentStep'));
	// 		var steps = this.get('steps');
	// 		var currentStep = this.get('currentStep');
	// 		var stepsIndex = currentStep - 1;
	// 		if(currentStep === steps.get('length')) {
	// 			console.log('last step');
	// 		} else {
	// 			this.transitionToRoute('lessons.show.step', steps.objectAt(stepsIndex+1));
	// 			this.set('currentStep', currentStep+1);
	// 		}
	// 	},
	// }
});

export default LessonsNewController;