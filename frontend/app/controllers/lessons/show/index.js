import Ember from 'ember';

var LessonsShowIndexController = Ember.ObjectController.extend({
	needs: 'lessonsShow',
	lesson: Ember.computed.alias('controllers.lessonsShow'),
	init: function() {
		this._super();
	},
	title: function() {
		return this.get('lesson').get('title');
	}.property('lesson.title'),
	author: function() {
		return this.get('lesson').get('author');
	}.property('lesson.author'),
	fullName: function() {
		return this.get('author').get('firstName') + ' ' + this.get('author').get('lastName');
	}.property('author.isFulfilled'),
	actions: {
		setCurrentStep: function() {
			this.get('lesson').set('currentStep', 0);
		},
	}
});

export default LessonsShowIndexController;