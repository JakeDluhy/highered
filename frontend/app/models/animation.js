import DS from 'ember-data';

var Animation = DS.ModelFragment.extend({
	params: DS.hasOneFragment('animationParams'),
	specialParams: DS.hasOneFragment('specialAnimationParams')
});

export default Animation;