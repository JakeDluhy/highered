import Ember from 'ember';

var LessonsShowRoute = Ember.Route.extend({
	model: function(params) {
		var lesson = this.store.find('lesson', params.lesson_id);
		return lesson;
	}
});

export default LessonsShowRoute;