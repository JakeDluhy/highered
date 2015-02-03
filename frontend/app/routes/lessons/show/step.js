import Ember from 'ember';

var LessonsShowStepRoute = Ember.Route.extend({
	model: function(params) {
		var step = this.store.find('lessonStep', params.step_id);
		return step;
	},
});

export default LessonsShowStepRoute;