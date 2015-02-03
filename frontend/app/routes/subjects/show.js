import Ember from 'ember';

var SubjectsShowRoute = Ember.Route.extend({
	model: function(params) {
		var subject = this.store.find('subject', params.subject_id);
		return subject;
	}
});

export default SubjectsShowRoute;