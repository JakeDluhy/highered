import Ember from 'ember';
import Session from '../objects/session';

export default {
    name: 'store-injector',
    after: 'store',
    initialize: function(container, application) {
    	application.register('session:main', Session, {singleton: true});
      application.inject('session:main', 'store', 'store:main');
      application.inject('controller', 'session', 'session:main');
      application.inject('route', 'session', 'session:main');
    }
};