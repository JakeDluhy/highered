import Ember from 'ember';
import DisplayLibrary from '../../libraries/mathAnimationLibrary/dist/display-library';

var DemosIntegralsView = Ember.View.extend({
  classNames: ['full-height-view'],
  templateName: 'demos/integrals',
  didInsertElement : function(){
    this.get('controller').on('setAxis', this, this.setAxis);
    this.get('controller').on('chooseDiscrete', this, this.chooseDiscrete);
    this.get('controller').on('showFunction', this, this.showFunction);

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
    (isDiscrete ? this.slideDown('.discrete-wrapper') : this.slideUp('.discrete-wrapper'));
  },
  showFunction: function(functionInput) {
    this.params.functionInput = functionInput;
    this.integralParams.functionInput = functionInput;
    this.display.create2DFunction(this.params);
    this.display.createIntegralDisplay(this.integralParams);
  },
  actions: {
    //Option setting event handlers
    setNumDiscrete: function(num) {
      this.integralParams.numDiscrete = num;
      this.display.createIntegralDisplay(this.integralParams);
    },
    dualBoundIntegrate: function(lower, upper) {
      this.integralParams.start = lower;
      this.integralParams.end = upper;
      this.display.createIntegralDisplay(this.integralParams);
    },
    //Controls
    resetDisplay: function() {
      this.display.clearDisplay();
      this.params = {
        functionInput: 0,
        axis: 'x',
        axisValue: 0,
        start: -10,
        end: 10
      };
      this.expandOptions();
    },

    //UI handling actions
    openContainers: function() {
      if(this.params.discrete) {this.slideDown('.discrete-wrapper')};
      this.slideDown('.range-wrapper');
      this.slideDown('.axis-wrapper');
    },
    expandOptions: function() {
      this.expandOptions();
    },
    collapseOptions: function() {
      this.collapseOptions();
    },
    discreteFinished: function() {
      this.slideUp('.discrete-wrapper');
      this.slideDown('.range-wrapper');
    },
    rangeFinished: function() {
      this.slideUp('.range-wrapper');
      this.slideDown('.axis-wrapper');
    },
    toggleDiscrete: function() {
      $('.discrete-wrapper').slideToggle()
    },
    toggleRange: function() {
      $('.range-wrapper').slideToggle();
    },
    toggleAxis: function() {
      $('.axis-wrapper').slideToggle();
    }
  },
  //UI handling fOptions
  expandOptions: function() {
    var self = this;
    var container = $('.options-container');
    container.animate({
      width: "0"
    }, 500, function() {
      self.get('controller').set('optionsView', true);
      container.animate({
        width: "20%"
      }, 1000, function() {
        console.log('done');
      });
    });
  },
  collapseOptions: function() {
    var self = this;
    var container = $('.options-container');
    container.animate({
      width: "0"
    }, 1000, function() {
      self.get('controller').set('optionsView', false);
      container.animate({
        width: "50px"
      }, 500, function() {
        console.log('done');
      });
    });
  },
  slideDown: function(classSelector) {
    $(classSelector).slideDown();
  },
  slideUp: function(classSelector) {
    $(classSelector).slideUp();
  },
});

export default DemosIntegralsView;