import Ember from "ember";

var DualSliderComponent = Ember.Component.extend({
	classNames: ['ember-slider'],
	classNameBindings: ['orientation'],
	first: -10.00,
	startFirst: -10.00,
	second: 10.00,
	startSecond: 10.00,
	rangeStart: -10.00,
	rangeEnd: 10.00,
	firstPercentage: 'left: 0%;',
	secondPercentage: 'left: 100%;',
	inputtingFirst: false,
	inputtingSecond: false,
	orientation: 'horizontal',
	init: function() {
		this.get('controller').on('resetSliders', this, this.reset);
		this.set('startFirst', this.get('first'));
		this.setFirstPercentage();
		this.set('startSecond', this.get('second'));
		this.setSecondPercentage();
		this._super();
	},
	setFirstPercentage: function() {
		var second = Number(this.get('second'));
		var first = this.get('first');
		if(first === '-') {return;} else { first = Number(first); }
		var rangeStart = Number(this.get('rangeStart'));
		var rangeEnd = Number(this.get('rangeEnd'));
		if(first < rangeStart) {
			first = rangeStart;
			this.set('first', first);
		} else if(first > second) {
			first = second;
			this.set('first', first);
		}
		var val = (first - rangeStart)/(rangeEnd - rangeStart)*100;
		if(this.get('orientation') === 'vertical') {
			this.set('firstPercentage', 'bottom: ' + val + '%;');
		} else {
			this.set('firstPercentage', 'left: ' + val + '%;');
		}
	}.observes('first'),
	setSecondPercentage: function() {
		var second = this.get('second');
		if(second === '-') { return; } else { second = Number(second); }
		var first = Number(this.get('first'));
		var rangeStart = Number(this.get('rangeStart'));
		var rangeEnd = Number(this.get('rangeEnd'));
		if(second < first) {
			second = first;
			this.set('second', second);
		} else if(second > rangeEnd) {
			second = rangeEnd;
			this.set('second', second);
		}
		var val = (second - rangeStart)/(rangeEnd - rangeStart)*100;
		if(this.get('orientation') === 'vertical') {
			this.set('secondPercentage', 'bottom: ' + val + '%;');
		} else {
			this.set('secondPercentage', 'left: ' + val + '%;');
		}
	}.observes('second'),
	actions: {
		moveFirstHandle: function() {
			var self = this;

			var rangeStart = this.get('rangeStart');
			var range = this.get('rangeEnd') - this.get('rangeStart');

			if(this.get('orientation') === 'vertical') {
				//Measuring from top
				var baseTop = this.$('.slider-base').offset().top;
				var baseBot = baseTop + this.$('.slider-base').height();
				var baseHeight = baseBot - baseTop;

				$(document).on('mousemove', function(event) {
					var baseOffset = baseBot - event.pageY;
					var val = (baseOffset/baseHeight)*range + rangeStart;
					self.set('first', self.roundIt(val));
					self.triggerAction(self.get('first'), self.get('second'));
				});
			} else {
				var baseLeft = this.$('.slider-base').offset().left;
				var baseRight = baseLeft + this.$('.slider-base').width();
				var baseWidth = baseRight - baseLeft;

				
				$(document).on('mousemove', function(event) {
					var baseOffset = event.pageX - baseLeft;
					var val = (baseOffset/baseWidth)*range + rangeStart;
					self.set('first', self.roundIt(val));
					self.triggerAction(self.get('first'), self.get('second'));
				});
			}
			$(document).on('mouseup', function() {
				$(document).off();
			});
		},
		moveSecondHandle: function() {
			var self = this;
			var rangeStart = this.get('rangeStart');
			var range = this.get('rangeEnd') - this.get('rangeStart');

			if(this.get('orientation') === 'vertical') {
				var baseTop = this.$('.slider-base').offset().top;
				var baseBot = baseTop + this.$('.slider-base').height();
				var baseHeight = baseBot - baseTop;

				$(document).on('mousemove', function(event) {
					var baseOffset = baseBot - event.pageY;
					var val = (baseOffset/baseHeight)*range + rangeStart;
					self.set('second', self.roundIt(val));
					self.triggerAction(self.get('first'), self.get('second'));
				});
			} else {
				var baseLeft = this.$('.slider-base').offset().left;
				var baseRight = baseLeft + this.$('.slider-base').width();
				var baseWidth = baseRight - baseLeft;

				$(document).on('mousemove', function(event) {
					var baseOffset = event.pageX - baseLeft;
					var val = (baseOffset/baseWidth)*range + rangeStart;
					self.set('second', self.roundIt(val));
					self.triggerAction(self.get('first'), self.get('second'));
				});
			}
			$(document).on('mouseup', function() {
				$(document).off();
			});
		},
		inputValueFirst: function() {
			this.toggleProperty('inputtingFirst');
		},
		inputValueSecond: function() {
			this.toggleProperty('inputtingSecond');
		},
		confirmValueSecond: function() {
			this.toggleProperty('inputtingSecond');
		},
		confirmValueFirst: function() {
			this.toggleProperty('inputtingFirst');
		},
	},
	triggerAction: function(pos1, pos2) {
		if(this.get('target') === 'view') {
			this.get('parentView').send(this.get('action'), pos1, pos2);
		} else {
			this.sendAction('action', pos1, pos2);
		}
	},
	roundIt: function(val) {
		return parseInt(val*100)/100;
	},
	reset: function() {
		this.set('first', this.get('startFirst'));
		this.set('second', this.get('startSecond'));
	}
});

export default DualSliderComponent;