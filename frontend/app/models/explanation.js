import DS from 'ember-data';

var Explanation = DS.ModelFragment.extend({
	instructions: DS.hasManyFragments('instruction')
});

export default Explanation;