import Ember from 'ember';
import Session from '../../objects/session';

var LessonsNewRoute = Ember.Route.extend({
	model: function() {
		var user = Session.currentUser();
		var lesson = this.store.createRecord('lesson', {
			title: 'Untitled',
			author: user
		});
		return lesson;
	}
});

export default LessonsNewRoute;