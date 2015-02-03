import DS from 'ember-data';

var SpecialAnimationParams = DS.ModelFragment.extend({
	keys: DS.hasManyFragments(),
	values: DS.hasManyFragments()
});

export default SpecialAnimationParams;