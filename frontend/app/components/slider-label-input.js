import Ember from 'ember';

var SliderLabelInput = Ember.TextField.extend({
	didInsertElement: function() {
		this.$().select();
	}
});

export default SliderLabelInput;