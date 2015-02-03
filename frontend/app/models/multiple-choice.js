import DS from 'ember-data';

var MultipleChoice = DS.ModelFragment.extend({
	question: DS.attr('string'),
	choices: DS.hasManyFragments('choice')
});

export default MultipleChoice;