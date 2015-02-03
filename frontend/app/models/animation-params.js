import DS from 'ember-data';

var AnimationParams = DS.ModelFragment.extend({
	keys: DS.hasManyFragments(),
	values: DS.hasManyFragments()
});

export default AnimationParams;