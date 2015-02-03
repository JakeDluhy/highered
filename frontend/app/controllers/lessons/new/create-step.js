import Ember from 'ember';
import stepChoices from '../../../definitions/stepArray';

var LessonsNewCreateStepController = Ember.ObjectController.extend({
	needs: 'lessonsShow',
	lesson: Ember.computed.alias('controllers.lessonsShow'),
	selectType: true,
	choices: stepChoices,
	// init: function() {
	// 	this._super();
	// },
	// title: function() {
	// 	return this.get('lesson').get('title');
	// }.property('lesson.title'),
	// author: function() {
	// 	return this.get('lesson').get('author');
	// }.property('lesson.author'),
	// fullName: function() {
	// 	return this.get('author').get('firstName') + ' ' + this.get('author').get('lastName');
	// }.property('author.isFulfilled'),
	// actions: {
	// 	setCurrentStep: function() {
	// 		this.get('lesson').set('currentStep', 0);
	// 	},
	// }
});

export default LessonsNewCreateStepController;