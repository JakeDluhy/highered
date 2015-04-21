import Ember from 'ember';
import AnimationMixin from '../../mixins/animation';

var DemosBridgeBuilderController = Ember.Controller.extend(Ember.Evented, AnimationMixin, {
  viewChoice: function() {
  	if(localStorage.getItem('environment') !== null) {
  		var env = JSON.parse(localStorage.getItem('environment'));
  		return env.view;
  	} else {
  		return 'side';
  	}
  }.property(),
  chooseView: function() {
    this.trigger('chooseView', this.get('viewChoice'));
  }.observes('viewChoice'),
});

export default DemosBridgeBuilderController;