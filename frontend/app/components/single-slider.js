import Ember from "ember";

var SingleSliderComponent = Ember.Component.extend({
	classNames: ['ember-slider'],
	classNameBindings: ['orientation'],
	pos: 0,
	startPos: 0,
	rangeStart: -10.00,
	rangeEnd: 10.00,
	percentage: 'left: 50%;',
	inputting: false,
	orientation: 'horizontal',
	init: function() {
		this.get('controller').on('resetSliders', this, this.reset);
		this.set('startPos', this.get('pos'));
		this.setPercentage();
		this._super();
	},
	setPercentage: function() {
		var pos = Number(this.get('pos'));
		if(pos === '-') {return;} else { pos = Number(pos); }
		var rangeStart = Number(this.get('rangeStart'));
		var rangeEnd = Number(this.get('rangeEnd'));
		if(pos < rangeStart) {
			pos = rangeStart;
			this.set('pos', pos);
		} else if(pos > rangeEnd) {
			pos = rangeEnd;
			this.set('pos', pos);
		}
		var val = (pos - rangeStart)/(rangeEnd - rangeStart)*100;
		if(this.get('orientation') === 'vertical') {
			this.set('percentage', 'bottom: ' + val + '%;');
		} else {
			this.set('percentage', 'left: ' + val + '%;');
		}
	}.observes('pos'),
	actions: {
		moveHandle: function() {
			var self = this;
			var rangeStart = this.get('rangeStart');
			var pos = this.get('pos');
			var range = this.get('rangeEnd') - this.get('rangeStart');
			if(this.get('orientation') === 'vertical') {
				//Measured from top
				var baseTop = this.$('.slider-base').offset().top;
				var baseBot = baseTop + this.$('.slider-base').height();
				var baseHeight = baseBot - baseTop;
				$(document).on('mousemove', function(event) {
					var baseOffset = baseBot - event.pageY;
					var val = (baseOffset/baseHeight)*range + rangeStart;
					self.set('pos', self.roundIt(val));
					self.sendAction('action', self.get('pos'));
				});
			} else {
				var baseLeft = this.$('.slider-base').offset().left;
				var baseRight = baseLeft + this.$('.slider-base').width();
				var baseWidth = baseRight - baseLeft;
				$(document).on('mousemove', function(event) {
					var baseOffset = event.pageX - baseLeft;
					var val = (baseOffset/baseWidth)*range + rangeStart;
					self.set('pos', self.roundIt(val));
					self.sendAction('action', self.get('pos'));
				});
			}
			$(document).on('mouseup', function() {
				$(document).off();
			});
		},
		inputValue: function() {
			this.toggleProperty('inputting');
		},
		confirmValue: function() {
			this.toggleProperty('inputting');
		},
	},
	roundIt: function(val) {
		return parseInt(val*100)/100;
	},
	reset: function() {
		this.set('pos', this.get('startPos'));
	},
	testIt: function() {
		console.log('Component');
	}
});

export default SingleSliderComponent;