import DS from 'ember-data';

var LessonStepType = DS.ModelFragment.extend({
	typeNumber: DS.attr('number'),
	animationType: DS.attr('number'),
});

export default LessonStepType;