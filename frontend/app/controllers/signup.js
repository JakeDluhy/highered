import Ember from 'ember';
import FlashQueue from '../objects/flash';

var SignupController = Ember.Controller.extend({
  loggedIn: function() {
    if(this.get('session').isLoggedIn()) {
      return true;
    }
    return false;
  }.property('session'),
	actions: {
		submitForm: function() {
			var self = this;
			var firstName = this.get('firstName'),
					lastName = this.get('lastName'),
					email = this.get('email'),
  				password = this.get('password');

			Ember.$.ajax('/signup', {
				"type": "POST",
				"dataType": 'JSON',
				"data": { // Begin data payload
          "firstName": firstName,
          "lastName": lastName,
          "email": email,
          "password": password
        }, // End data payload
        "success": function (data, textStatus, jqXHR) {
          if(data.error) {
          	FlashQueue.pushFlash('warning', data.error);
          } else {
            self.get('session').login(data.user, false, function() {
              FlashQueue.pushFlash('notice', 'Welcome to HigherEd!');
            });
          }
          self.transitionToRoute('index');
        },
        "error": function (jqXHR, textStatus, errorThrown) {
          window.console.log(jqXHR);
        }
			});
		}
	}
});

export default SignupController;