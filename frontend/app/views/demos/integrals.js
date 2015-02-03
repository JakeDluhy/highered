import Ember from 'ember';
import DisplayLibrary from '../../libraries/mathAnimationLibrary/dist/display-library';

var DemosIntegralsView = Ember.View.extend({
  classNames: ['full-height-view'],
  templateName: 'demos/integrals',
  didInsertElement : function(){
    this.get('controller').on('setAxis', this, this.setAxis);
    this.get('controller').on('chooseDiscrete', this, this.chooseDiscrete);
    this.get('controller').on('setNumDiscrete', this, this.setNumDiscrete);
    this.get('controller').on('showFunction', this, this.showFunction);
    this.get('controller').on('lowerBoundIntegrate', this, this.lowerBoundIntegrate);
    this.get('controller').on('upperBoundIntegrate', this, this.upperBoundIntegrate);
    this.get('controller').on('dualBoundIntegrate', this, this.dualBoundIntegrate);
    this.get('controller').on('resetDisplay', this, this.resetDisplay);

    this.get('controller').on('toggleSubContainer', this, this.toggleSubContainer);
    this.get('controller').on('slideUpSubContainer', this, this.slideUpSubContainer);
    this.get('controller').on('slideDownSubContainer', this, this.slideDownSubContainer);

    this.params = {
      functionInput: 0,
      axis: 'x',
      start: -10,
      end: 10
    };
    this.integralParams = {
      functionInput: 0,
      axis: 'x',
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
    this.integralParams.axis = axis;
  },
  chooseDiscrete: function(isDiscrete) {
    this.integralParams.discrete = true;
    this.integralParams.numDiscrete = 10;
    this.showFunction(this.params.functionInput);
  },
  setNumDiscrete: function(numDiscrete) {
    this.integralParams.numDiscrete = numDiscrete;
  },
  showFunction: function(functionInput) {
    this.params.functionInput = functionInput;
    this.integralParams.functionInput = functionInput;
    this.display.create2DFunction(this.params);
    this.display.createIntegralDisplay(this.integralParams);
  },
  lowerBoundIntegrate: function(lowerBound) {
    this.integralParams.start = lowerBound;
    this.display.createIntegralDisplay(this.integralParams);
  },
  upperBoundIntegrate: function(upperBound) {
    this.integralParams.end = upperBound;
    this.display.createIntegralDisplay(this.integralParams);
  },
  dualBoundIntegrate: function(lower, upper) {
    this.integralParams.start = lower;
    this.integralParams.end = upper;
    this.display.createIntegralDisplay(this.integralParams);
  },
  resetDisplay: function() {
    this.display.clearDisplay();
    this.params = {
      functionInput: 0,
      axis: 'x',
      start: -10,
      end: 10
    };
    this.integralParams = {
      functionInput: 0,
      axis: 'x',
      start: -10,
      end: 10
    };
    //Send action into component? Reset handles?
  },
  toggleContainers: function() {
    var controlBoxes = $('.content-wrapper');
    controlBoxes.animate({
      height: 'toggle'
    }, 1000);
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

export default DemosIntegralsView;