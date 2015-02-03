import Ember from 'ember';

var SubjectsIndexRoute = Ember.Route.extend({
	model: function() {
		var subjects = this.store.find('subject');
		return subjects;
	}
});

export default SubjectsIndexRoute;