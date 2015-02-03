import DS from 'ember-data';

var Subject = DS.Model.extend({
  title: DS.attr('string'),
  sections: DS.hasMany('section')
});

export default Subject;