import Ember from 'ember';
import DisplayLibrary from '../../libraries/mathAnimationLibrary/dist/display-library';
// import FileSaver from 'FileSaver';

var DemosCrossSectionsView = Ember.View.extend({
  classNames: ['full-height-view'],
  templateName: 'demos/cross-sections',
  didInsertElement : function(){
    this.get('controller').on('setAxis', this, this.setAxis);
    this.get('controller').on('chooseShape', this, this.chooseShape);
    this.get('controller').on('showFunctions', this, this.showFunctions);

    this.firstParams = {
      functionInput: 0,
      axis: 'x',
      start: -10,
      end: 10,
      name: 'firstFunction',
      color: 'red'
    };

    this.secondParams = {
      functionInput: 0,
      axis: 'x',
      start: -10,
      end: 10,
      name: 'secondFunction',
      color: 'green'
    };

    this.crossSectionParams =  {
      functionOne: 0,
      functionTwo: 0,
      axis: 'x',
      csShape: 'square',
      crossSecions: 10,
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
    this.firstParams.axis = axis;
    this.secondParams.axis = axis;
    this.crossSectionParams.axis = axis;
  },
  chooseShape: function(shape) {
    this.crossSectionParams.csShape = shape;
  },
  showFunctions: function(functionOne, functionTwo) {
    if(functionOne !== undefined) { this.firstParams.functionInput = functionOne; }
    if(functionTwo !== undefined) { this.secondParams.functionInput = functionTwo; }
    this.display.create2DFunction(this.firstParams);
    this.display.create2DFunction(this.secondParams);
    this.crossSectionParams.functionOne = functionOne;
    this.crossSectionParams.functionTwo = functionTwo;
  },
  actions: {
    //Option setting event handlers
    setNumCrossSections: function(num) {
      this.crossSectionParams.crossSecions = num;
    },
    dualBoundRestrict: function(lower, upper) {
      this.crossSectionParams.start = lower;
      this.crossSectionParams.end = upper;
      this.firstParams.start = lower;
      this.firstParams.end = upper;
      this.secondParams.start = lower;
      this.secondParams.end = upper;
      this.display.create2DFunction(this.firstParams);
      this.display.create2DFunction(this.secondParams);
    },
    showShape: function(shape) {
      this.display.crossSection3D(this.crossSectionParams);
      this.collapseOptions();
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
    rangeFinished: function() {
      this.slideUp('.range-wrapper');
      this.slideDown('.cross-section-wrapper');
    },
    crossSectionsFinished: function() {
      this.slideUp('.cross-section-wrapper');
    },
    toggleCrossSections: function() {
      $('.cross-section-wrapper').slideToggle();
    },
    toggleRange: function() {
      $('.range-wrapper').slideToggle();
    },
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

export default DemosCrossSectionsView;