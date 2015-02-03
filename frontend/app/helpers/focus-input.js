import Ember from 'ember';

var FocusInput = Ember.TextField.extend({
	didInsertElement: function() {
		this.$().select();
	}
});

export default Ember.Handlebars.helper('focus-input', FocusInput);