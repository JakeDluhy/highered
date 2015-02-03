import Ember from 'ember';
// import Session from '../objects/session';

var ApplicationController = Ember.Controller.extend({
  loggedIn: function() {
    if(this.get('session').isLoggedIn()) {
      return true;
    }
    return false;
  }.property('session.loggedIn')
});

export default ApplicationController;