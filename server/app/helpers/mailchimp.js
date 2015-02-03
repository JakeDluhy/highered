var MailChimpAPI = require('mailchimp').MailChimpAPI;

var apiKey = 'b3f301564d564eb216150dca3f63a074-us10';
var mailingListID = '084f4557f0';

try {
	var api = new MailChimpAPI(apiKey, {version: '2.0'});
} catch(error) {
	console.log(error.message);
}

module.exports = {
	subscribe: function(email, firstName, lastName) {
		data = {
			id: mailingListID,
			email: {
				email: email
			},
			merge_vars: {
				EMAIL: email,
				FNAME: firstName,
				LNAME: lastName
			},
			double_optin: false,
			send_welcome: true
		}
		api.call('lists', 'subscribe', data, function(err, data) {
			if(err) {
				console.log(err);
			} else {
				console.log(JSON.stringify(data));
			}
		});
	},
	unsubscribe: function(email) {
		data = {
			id: mailingListID,
			email: {
				email: email
			},
			delete_member: true
		}
	}
};