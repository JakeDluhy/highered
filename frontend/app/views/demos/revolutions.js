import Ember from 'ember';
import DisplayLibrary from '../../libraries/mathAnimationLibrary/dist/display-library';
// import FileSaver from 'FileSaver';

var DemosRevolutionsView = Ember.View.extend({
  classNames: ['full-height-view'],
  templateName: 'demos/revolutions',
  didInsertElement : function(){
    this.get('controller').on('setAxis', this, this.setAxis);
    this.get('controller').on('chooseDiscrete', this, this.chooseDiscrete);
    this.get('controller').on('showFunction', this, this.showFunction);

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
    (isDiscrete ? this.slideDown('.discrete-wrapper') : this.slideUp('.discrete-wrapper'));
  },
  showFunction: function(functionInput) {
    this.params.functionInput = functionInput;
    this.display.create2DFunction(this.params);
    (this.params.discrete ? this.slideDown('.discrete-wrapper') : this.slideDown('.range-wrapper'));
  },
  actions: {
    //Option setting event handlers
    setNumDiscrete: function(num) {
      this.params.numDiscrete = num;
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

    //Controls for the animation
    startAnimation: function() {
      this.display.createRotationFunction(this.params);
      this.collapseOptions();
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
    getSTLFile: function() {
      var name = this.get('controller').get('printName');
      var blob = this.display.getSTLFile(this.params);
      saveAs(blob, (name + '.stl'));
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
      this.expandOptions();
    },

    //UI handling actions
    openContainers: function() {
      if(this.params.discrete) {this.slideDown('.discrete-wrapper');}
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
      $('.discrete-wrapper').slideToggle();
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

export default DemosRevolutionsView;