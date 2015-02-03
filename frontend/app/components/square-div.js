import Ember from "ember";

var SquareDivComponent = Ember.Component.extend({
	addedClass: '',
	centerVertically: false,
	didInsertElement: function() {
		this.setHeight();
		console.log(this.get('centerVertically'));
		if(this.get('centerVertically') === true) {
			this.center();
		}
		$(window).bind('resize', this.setHeight);
	},
	willDestroy: function() {
		$(window).unbind('resize', this.setHeight);
	},
	setHeight: function() {
		var container = $('.square-div');
    var width = container.width();
    container.css('height', width);
	},
	center: function() {
		var containers = $('.square-div');
		containers.each(function(i, element) {
			var containerHeight = $(element).height();
			var content = $(element).find('.content');
			var contentHeight = content.height();
			var margin = (containerHeight - contentHeight)/2;
			content.css('margin-top', margin);
		});
	}
});

export default SquareDivComponent;