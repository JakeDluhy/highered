import Ember from 'ember';

var LessonsIndexRoute = Ember.Route.extend({
	model: function() {
		var lessons = this.store.find('lesson');
		return lessons;
	}
});

export default LessonsIndexRoute;