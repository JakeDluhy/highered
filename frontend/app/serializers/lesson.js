import DS from 'ember-data';

var LessonSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    lessonSteps: { embedded: 'always' }
  },
  normalize: function(type, hash, prop) {
  	hash.id = hash._id;
    delete hash._id;
    return this._super(type, hash, prop);
  }
});

export default LessonSerializer;