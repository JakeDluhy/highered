import DS from 'ember-data';

var Lesson = DS.Model.extend({
  title: DS.attr('string'),
  author: DS.belongsTo('user', {async: true}),
  updatedAt: DS.attr('date'),
  lessonSteps: DS.hasMany('lessonStep')
});

export default Lesson;