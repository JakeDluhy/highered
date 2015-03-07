import Ember from 'ember';

var FocusInput = Ember.TextField.extend({
	didInsertElement: function() {
		this.$().select();
	}
});

export default FocusInput;