import DS from 'ember-data';

var Section = DS.Model.extend({
	title: DS.attr('string'),
	subject: DS.belongsTo('subject')
});

export default Section;