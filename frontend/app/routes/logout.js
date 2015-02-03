import Ember from 'ember';

var LogoutRoute = Ember.Route.extend({
	beforeModel: function() {
		var self = this;
		this.get('session').logout(function() {
			self.transitionTo('index');
		});
	}
});

export default LogoutRoute;