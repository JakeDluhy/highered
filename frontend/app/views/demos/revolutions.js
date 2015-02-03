import Ember from 'ember';
import DisplayLibrary from '../../libraries/mathAnimationLibrary/dist/display-library';

var DemosRevolutionsView = Ember.View.extend({
  classNames: ['full-height-view'],
  templateName: 'demos/revolutions',
  didInsertElement : function(){
    this.get('controller').on('setAxis', this, this.setAxis);
    this.get('controller').on('chooseDiscrete', this, this.chooseDiscrete);
    this.get('controller').on('setNumDiscrete', this, this.setNumDiscrete);
    this.get('controller').on('showFunction', this, this.showFunction);
    this.get('controller').on('lowerBoundRestrict', this, this.lowerBoundRestrict);
    this.get('controller').on('upperBoundRestrict', this, this.upperBoundRestrict);
    this.get('controller').on('dualBoundRestrict', this, this.dualBoundRestrict);
    this.get('controller').on('showAxis', this, this.showAxis);
    this.get('controller').on('startAnimation', this, this.startAnimation);
    this.get('controller').on('playAnimation', this, this.playAnimation);
    this.get('controller').on('pauseAnimation', this, this.pauseAnimation);
    this.get('controller').on('slowAnimation', this, this.slowAnimation);
    this.get('controller').on('speedAnimation', this, this.speedAnimation);
    this.get('controller').on('resetDisplay', this, this.resetDisplay);

    this.get('controller').on('toggleSubContainer', this, this.toggleSubContainer);
    this.get('controller').on('slideUpSubContainer', this, this.slideUpSubContainer);
    this.get('controller').on('slideDownSubContainer', this, this.slideDownSubContainer);

    this.params = {
      functionInput: 0,
      axis: 'x',
      axisValue: 0,
      start: -10,
      end: 10
    };

    var self = this;
    Ember.run.next(function(){
      var container = $('.primary-container');
      var javaContainer = container[0];
      var display = new DisplayLibrary(container, javaContainer, true, false, false);
      self.display = display;
    });
  },
  setAxis: function(axis) {
    this.params.axis = axis;
  },
  chooseDiscrete: function(isDiscrete) {
    this.params.discrete = isDiscrete;
    this.params.numDiscrete = 10;
  },
  setNumDiscrete: function(num) {
    console.log(num);
    this.params.numDiscrete = num;
    console.log(this.params);
  },
  showFunction: function(functionInput) {
    this.params.functionInput = functionInput;
    this.display.create2DFunction(this.params);
  },
  lowerBoundRestrict: function(lowerBound) {
    this.params.start = lowerBound;
    this.display.create2DFunction(this.params);
  },
  upperBoundRestrict: function(upperBound) {
    this.params.end = upperBound;
    this.display.create2DFunction(this.params);
  },
  dualBoundRestrict: function(lower, upper) {
    this.params.start = lower;
    this.params.end = upper;
    this.display.create2DFunction(this.params);
  },
  showAxis: function(axisVal) {
    this.params.axisValue = axisVal;
    this.display.createAxis(this.params);
  },
  startAnimation: function() {
    this.display.createRotationFunction(this.params);
    console.log(this.params);
    this.toggleContainers();
  },
  playAnimation: function() {
    this.display.playAnimation();
  },
  pauseAnimation: function() {
    this.display.pauseAnimation();
  },
  slowAnimation: function() {
    this.display.animationSpeed *= 0.5;
  },
  speedAnimation: function() {
    this.display.animationSpeed *= 2;
  },
  resetDisplay: function() {
    this.display.clearDisplay();
    this.params = {
      functionInput: 0,
      axis: 'x',
      axisValue: 0,
      start: -10,
      end: 10
    };
    this.toggleContainers();
  },
  toggleContainers: function() {
    var controlBoxes = $('.content-wrapper');
    controlBoxes.slideToggle(1000);
  },
  toggleSubContainer: function(classSelector) {
    var container = $(classSelector);
    container.slideToggle();
  },
  slideUpSubContainer: function(classSelector) {
    var container = $(classSelector);
    container.slideUp();
  },
  slideDownSubContainer: function(classSelector) {
    var container = $(classSelector);
    container.slideDown();
  }
});

export default DemosRevolutionsView;