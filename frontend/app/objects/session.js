import Ember from 'ember';
import App from '../app';
import FlashQueue from './flash';

var Session = Ember.Object.extend({
	loggedIn: false,
	userId: '',

	onAppLoad: function(cb) {
		var rememberToken = Ember.$.cookie('rememberToken');
		var encryptedId = Ember.$.cookie('encryptedId');
		if(rememberToken && encryptedId) {
			this.checkRememberToken(rememberToken, encryptedId, cb);
		} else {
			cb();
		}
	},

	isLoggedIn: function() {
		return this.get('loggedIn');
	},

	currentUser: function() {
		var store = this.get('store');
		var userId = this.get('userId');
		if(this.get('loggedIn')) {
			return store.getById('user', userId);
		} else {
			return null;
		}
	},

	login: function(user, extendedLogin, cb) {
		var self = this;
		this.loadUser(user, function() {
			var rememberToken = self.createRandom();
			if(extendedLogin) {
				Ember.$.cookie('rememberToken', rememberToken, {expires: 7, path: '/'});
			} else {
				Ember.$.cookie('rememberToken', rememberToken, {path: '/'});
			}
			self.sendRememberToken(rememberToken, extendedLogin, user);
			cb();
		});
	},

	loadUser: function(user, cb) {
		var store = this.get('store');
		console.log(user);
		store.push('user', {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			lessons: user.lessons
		});
		this.set('userId', user._id);
		this.set('loggedIn', true);
		cb();
	},

	logout: function(cb) {
		this.set('userId', '');
		this.set('loggedIn', false);
		$.removeCookie('rememberToken');
		$.removeCookie('encryptedId');
		FlashQueue.pushFlash('notice', 'Successfully logged out');
		cb();
	},

	createRandom: function() {
		var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
	},

	sendRememberToken: function(token, extendedLogin, user) {
		console.log(user);
		Ember.$.ajax('/session/save', {
			"type": "POST",
			"dataType": 'JSON',
			"data": { // Begin data payload
        "rememberToken": token,
        "user": user
      }, // End data payload
      "success": function (data, textStatus, jqXHR) {
      	if(extendedLogin) {
      		Ember.$.cookie('encryptedId', data.encryptedId, {expires: 7, path: '/'});
      	} else {
      		Ember.$.cookie('encryptedId', data.encryptedId, {path: '/'});
      	}
        
      },
      "error": function (jqXHR, textStatus, errorThrown) {
        window.console.log(jqXHR);
      }
		});
	},

	checkRememberToken: function(token, encryptedId, cb) {
		var self = this;
		Ember.$.ajax('/session/check', {
			"type": "POST",
			"dataType": 'JSON',
			"data": { // Begin data payload
        "rememberToken": token,
        "encryptedId": encryptedId
      }, // End data payload
      "success": function (data, textStatus, jqXHR) {
        if(data.user) {
        	self.loadUser(data.user, cb);
        }
      },
      "error": function (jqXHR, textStatus, errorThrown) {
        window.console.log(jqXHR);
      }
		});
	}
});

export default Session;