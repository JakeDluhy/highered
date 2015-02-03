import DS from 'ember-data';

var ApplicationSerializer = DS.RESTSerializer.extend({
  primaryKey: "_id",
  keyForRelationship: function(key, relationship) {
    return key;
  }
});

export default ApplicationSerializer;