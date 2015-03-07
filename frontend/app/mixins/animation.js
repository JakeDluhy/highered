import Ember from 'ember';

var AnimationMixin = Ember.Mixin.create({
  optionsView: true,
  axisIsX: true,
  continuous: true,
  printing: false,
  setAxis: function() {
    var axis;
    (this.get('axisIsX') === true ? axis = 'x' : axis = 'y');
    this.trigger('setAxis', axis);
  }.observes('axisIsX'),
  chooseDiscrete: function() {
    this.trigger('chooseDiscrete', !this.get('continuous'));
  }.observes('continuous'),
  actions: {
    showFunction: function() {
      var functionInput = this.get('functionInput');
      this.trigger('showFunction', functionInput);
    },
    printContainer: function() {
      this.toggleProperty('printing');
    }
  },
});

export default AnimationMixin;