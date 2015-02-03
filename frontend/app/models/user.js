import DS from 'ember-data';

var User = DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string'),
  lessons: DS.hasMany('lesson', {async: true})
});

export default User;