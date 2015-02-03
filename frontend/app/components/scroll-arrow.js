import Ember from "ember";

var ScrollArrowComponent = Ember.Component.extend({
	direction: '',
	divClass: '',
	visible: false,
	actions: {
		showIt: function() {
			this.set('visible', true);
		},
		hideIt: function() {
			this.set('visible', false);
		},
		scrollIt: function() {
			var targetDiv = $('.'+this.get('divClass'));
			$(document.body).animate({
		    'scrollTop':   targetDiv.offset().top - $(document.body).offset().top
			}, 1000);
		}
	}
});

export default ScrollArrowComponent;