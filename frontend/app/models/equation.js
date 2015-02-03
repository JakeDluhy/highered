import DS from 'ember-data';

var Equation = DS.Model.extend({
  title: DS.attr('string'),
  parts: DS.hasManyFragments('equationPart')
});

export default Equation;