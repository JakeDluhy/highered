import Ember from 'ember';

var AnimationMixin = Ember.Mixin.create({
  defaultView: true,
  axisIsX: true,
  discrete: false,
  actions: {
    setXaxis: function() {
      this.set('axisIsX', true);
      this.trigger('setAxis', 'x');
    },
    setYaxis: function() {
      this.set('axisIsX', false);
      this.trigger('setAxis', 'y');
    },
    makeDiscrete: function() {
      this.set('discrete', true);
      this.trigger('chooseDiscrete', true);
    },
    makeNotDiscrete: function() {
      this.set('discrete', false);
      this.trigger('chooseDiscrete', false);
    },
    setNumDiscrete: function(numDiscrete) {
      this.trigger('setNumDiscrete', numDiscrete);
    },
    showFunction: function() {
      var functionInput = this.get('functionInput');
      this.trigger('showFunction', functionInput);
      if(this.get('discrete')) {
        this.slideDownDiscrete();
      } else {
        this.slideDownRange();
      }
    },
    dualBoundRestrict: function(lower, upper) {
      this.trigger('dualBoundRestrict', lower, upper);
    },
    showAxis: function(axisVal) {
      this.trigger('showAxis', axisVal);
    },

    //Integrals Specific
    dualBoundIntegrate: function(lower, upper) {
      this.trigger('dualBoundIntegrate', lower, upper);
    },

    //Derivatives Specific
    showDerivative: function(location) {
      this.trigger('showDerivative', location);
    },
    showDerivativeFunction: function() {
      var functionInput = this.get('functionInput');
      this.trigger('showFunction', functionInput);
      this.slideDownLocation();
    },

    //Animation Controls
    startAnimation: function() {
      this.slideUpAxis();
      this.trigger('startAnimation');
    },
    playAnimation: function() {
      this.trigger('playAnimation');
    },
    pauseAnimation: function() {
      this.trigger('pauseAnimation');
    },
    slowAnimation: function() {
      this.trigger('slowAnimation');
    },
    speedAnimation: function() {
      this.trigger('speedAnimation');
    },
    resetDisplay: function() {
      this.trigger('resetDisplay');
      this.trigger('resetSliders');
      this.set('functionInput', '');
    },

    //UI actions
    toggleDiscrete: function() {
      this.trigger('toggleSubContainer', '.discrete-wrapper');
    },
    toggleRange: function() {
      this.trigger('toggleSubContainer', '.range-wrapper');
    },
    toggleLocation: function() {
      this.trigger('toggleSubContainer', '.location-wrapper');
    },
    toggleAxis: function() {
      this.trigger('toggleSubContainer', '.axis-wrapper');
    },
    discreteFinished: function() {
      this.slideUpDiscrete();
      this.slideDownRange();
    },
    rangeFinished: function() {
      this.slideUpRange();
      this.slideDownAxis();
    },
    axisFinished: function() {
      this.slideUpAxis();
    }
  },
  slideUpDiscrete: function() {
    this.trigger('slideUpSubContainer', '.discrete-wrapper');
  },
  slideUpRange: function() {
    this.trigger('slideUpSubContainer', '.range-wrapper');
  },
  slideUpAxis: function() {
    this.trigger('slideUpSubContainer', '.axis-wrapper');
  },
  slideDownDiscrete: function() {
    this.trigger('slideDownSubContainer', '.discrete-wrapper');
  },
  slideDownRange: function() {
    this.trigger('slideDownSubContainer', '.range-wrapper');
  },
  slideDownAxis: function() {
    this.trigger('slideDownSubContainer', '.axis-wrapper');
  },

  slideDownLocation: function() {
    this.trigger('slideDownSubContainer', '.location-wrapper');
  },
  testIt: function() {
    console.log('Controller');
  }
});

export default AnimationMixin;