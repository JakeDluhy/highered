import DS from 'ember-data';

var Instruction = DS.ModelFragment.extend({
	orderNumber: DS.attr('number'),
	content: DS.attr('string')
});

export default Instruction;