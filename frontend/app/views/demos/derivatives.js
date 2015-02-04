import Ember from 'ember';
import DisplayLibrary from '../../libraries/mathAnimationLibrary/dist/display-library';

var DemosDerivativesView = Ember.View.extend({
  classNames: ['full-height-view'],
  templateName: 'demos/derivatives',
  didInsertElement : function(){
    this.get('controller').on('showFunction', this, this.showFunction);

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
    this.display.showDerivative(this.derivativeParams);
    this.slideDown('.location-wrapper');
  },
  actions: {
    //Option setting
    showDerivative: function(location) {
      this.derivativeParams.location = location;
      this.display.showDerivative(this.derivativeParams);
    },
    //Controls
    resetDisplay: function() {
      this.display.clearDisplay();
      this.params = {
        functionInput: 0,
        start: -10,
        end: 10
      };
      this.derivativeParams = {
        functionInput: 0,
        location: 0
      };
      this.expandOptions();
    },
    //UI handling actions
    openContainers: function() {
      this.slideDown('.location-wrapper');
    },
    expandOptions: function() {
      this.expandOptions();
    },
    collapseOptions: function() {
      this.collapseOptions();
    },
    toggleLocation: function() {
      $('.location-wrapper').slideToggle()
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
  }
});

export default DemosDerivativesView;