import DS from 'ember-data';

var SubjectSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    sections: { embedded: 'always' }
  },
  normalize: function(type, hash, prop) {
  	hash.id = hash._id;
    delete hash._id;
    return this._super(type, hash, prop);
  }
});