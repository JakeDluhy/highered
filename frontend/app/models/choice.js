import DS from 'ember-data';

var Choice = DS.ModelFragment.extend({
	choiceId: DS.attr('number'),
	content: DS.attr('string'),
	correctAnswer: DS.attr('boolean'),
	answerResponse: DS.attr('string')
});

export default Choice;