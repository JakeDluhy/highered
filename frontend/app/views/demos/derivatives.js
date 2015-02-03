import Ember from 'ember';
import DisplayLibrary from '../../libraries/mathAnimationLibrary/dist/display-library';

var DemosDerivativesView = Ember.View.extend({
  classNames: ['full-height-view'],
  templateName: 'demos/derivatives',
  didInsertElement : function(){
    this.get('controller').on('showFunction', this, this.showFunction);
    this.get('controller').on('showDerivative', this, this.showDerivative);
    this.get('controller').on('resetDisplay', this, this.resetDisplay);

    this.get('controller').on('toggleSubContainer', this, this.toggleSubContainer);
    this.get('controller').on('slideUpSubContainer', this, this.slideUpSubContainer);
    this.get('controller').on('slideDownSubContainer', this, this.slideDownSubContainer);

    this.params = {
      functionInput: 0,
      start: -10,
      end: 10
    };
    this.derivativeParams = {
      functionInput: 0,
      location: 0
    };

    var self = this;
    Ember.run.next(function(){
      var container = $('.primary-container');
      var javaContainer = container[0];
      var display = new DisplayLibrary(container, javaContainer, true, false, false);
      self.display = display;
    });
  },
  showFunction: function(functionInput) {
    this.params.functionInput = functionInput;
    this.derivativeParams.functionInput = functionInput;
    this.display.create2DFunction(this.params);
    this.showDerivative(this.derivativeParams);
  },
  showDerivative: function(location) {
    this.derivativeParams.location = location;
    this.display.showDerivative(this.derivativeParams);
  },
  resetDisplay: function() {
    this.display.clearDisplay();
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
    console.log(container);
    container.slideDown();
  }
});

export default DemosDerivativesView;