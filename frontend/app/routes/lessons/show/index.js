import Ember from 'ember';

var LessonsShowIndexRoute = Ember.Route.extend({
	setupController: function(controller, model) {
		controller.send('setCurrentStep');
	}
});

export default LessonsShowIndexRoute;