import DS from 'ember-data';

var EquationPart = DS.ModelFragment.extend({
	content: DS.attr('string'),
  explanation: DS.attr('string')
});

export default EquationPart;