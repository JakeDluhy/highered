import Ember from 'ember';
import Session from '../objects/session';

export default {
	name: 'SessionSetup',
	after: 'store-injector',
	initialize: function(container, application) {
		var session = container.lookup('session:main');
		application.deferReadiness();
		session.onAppLoad(function() {
			application.advanceReadiness();
		});
	}
};