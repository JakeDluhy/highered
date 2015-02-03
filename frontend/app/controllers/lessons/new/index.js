import Ember from 'ember';

var LessonsNewIndexController = Ember.ObjectController.extend({
	needs: 'lessonsNew',
	lesson: Ember.computed.alias('controllers.lessonsNew'),
	title: 'Untitled',
	editTitle: false,
	setTitle: function() {
		this.get('lesson').setTitle(this.get('title'));
	}.observes('title'),
	author: function() {
		return this.get('lesson').get('author');
	}.property('lesson.author'),
	fullName: function() {
		return this.get('author').get('firstName') + ' ' + this.get('author').get('lastName');
	}.property('author.isFulfilled'),
	actions: {
		editTitle: function() {
			this.set('editTitle', true);
		},
		stopEdit: function() {
			this.set('editTitle', false);
		}
	}
});

export default LessonsNewIndexController;