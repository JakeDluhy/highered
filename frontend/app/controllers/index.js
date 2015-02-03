import Ember from 'ember';
import Session from '../objects/session';
import FlashQueue from '../objects/flash';

var IndexController = Ember.Controller.extend({
  loggedIn: function() {
    if(this.get('session').isLoggedIn()) {
      return true;
    }
    return false;
  }.property('session.loggedIn'),
	actions: {
		submitSignup: function() {
			var self = this;
			var email = this.get('email');

			Ember.$.ajax('/signup', {
				"type": "POST",
				"dataType": 'JSON',
				"data": { // Begin data payload
          "email": email
        }, // End data payload
        "success": function (data, textStatus, jqXHR) {
          if(data.error) {
          	FlashQueue.pushFlash('error', data.error);
          } else {
          	FlashQueue.pushFlash('notice', 'Welcome to the mailing list!');
          }
        },
        "error": function (jqXHR, textStatus, errorThrown) {
          window.console.log(jqXHR);
        }
			});
		}
	}
});

export default IndexController;