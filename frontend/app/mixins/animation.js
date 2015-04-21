import Ember from 'ember';

var AnimationMixin = Ember.Mixin.create({
  optionsView: true,
  axisIsX: true,
  continuous: true,
  shape: 'square',
  printing: false,
  setAxis: function() {
    var axis;
    (this.get('axisIsX') === true ? axis = 'x' : axis = 'y');
    this.trigger('setAxis', axis);
  }.observes('axisIsX'),
  chooseDiscrete: function() {
    this.trigger('chooseDiscrete', !this.get('continuous'));
  }.observes('continuous'),
  chooseShape: function() {
    this.trigger('chooseShape', this.get('shape'));
  }.observes('shape'),
  actions: {
    showFunction: function() {
      var functionInput = this.get('functionInput');
      this.trigger('showFunction', functionInput);
    },
    showFunctions: function() {
      var functionOne = this.get('functionOne');
      var functionTwo = this.get('functionTwo');
      this.trigger('showFunctions', functionOne, functionTwo);
    },
    printContainer: function() {
      this.toggleProperty('printing');
    }
  },
});

export default AnimationMixin;