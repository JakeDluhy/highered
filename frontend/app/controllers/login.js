import Ember from 'ember';
import FlashQueue from '../objects/flash';

var LoginController = Ember.Controller.extend({
  loggedIn: function() {
    if(this.get('session').isLoggedIn()) {
      return true;
    }
    return false;
  }.property('session'),
	actions: {
		submitForm: function() {
			var self = this;
			var email = this.get('email'),
				  password = this.get('password'),
          extendedLogin = this.get('rememberMe');

			Ember.$.ajax('/login', {
				"type": "POST",
				"dataType": 'JSON',
				"data": { // Begin data payload
          "email": email,
          "password": password
        }, // End data payload
        "success": function (data, textStatus, jqXHR) {
          console.log(data);
          if(data.error) {
          	FlashQueue.pushFlash('error', data.error);
          	console.log(data.error);
          } else {
          	self.get('session').login(data.user, extendedLogin, function() {
              self.transitionToRoute('index');
            });
          }
        },
        "error": function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
        }
			});
		}
	}
});

export default LoginController;