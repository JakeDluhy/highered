import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  //Authentication
	this.route('login');
  this.route('logout');
  this.route('signup');

  //Demos
  this.resource('demos', function() {
    this.route('revolutions');
    this.route('integrals');
    this.route('derivatives');
  });

  //Lessons
  this.resource('lessons', function() {
    this.resource('lessons.new', {path: '/new'}, function() {
      this.route('step', { path: '/:step_id'});
      this.route('createStep');
    });
    this.resource('lessons.show', { path: '/:lesson_id'}, function() {
      this.route('step', { path: '/:step_id'});
    });
  });

  //Subjects
  this.resource('subjects', function() {
    this.route('show', { path: '/:subject_id'});
  });

  //Info links
  // this.route('about');
  // this.route('blog');
  // this.route('contact');
});

export default Router;
