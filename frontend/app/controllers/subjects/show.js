import Ember from 'ember';

var SubjectsShowController = Ember.ObjectController.extend({
	demo: function() {
		var subject = this.get('model');
		var sections = this.get('sections');
		console.log(sections.get('currentState')[0].get('title'));
	}.property('demo')
});

export default SubjectsShowController;