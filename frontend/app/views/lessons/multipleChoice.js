import Ember from 'ember';

var LessonsMultipleChoiceView = Ember.View.extend({
	templateName: 'lessons/multipleChoice',
	didInsertElement: function() {
		this.setHeight();
		this.verticallyCenter();
		$(window).bind('resize', this.setHeight);
	},
	willDestroy: function() {
		$(window).unbind('resize', this.setHeight);
	},
	setHeight: function() {
		var fullContainerHeight = $('.lesson-main-container').height();
		var questionContainerHeight = $('.question-container').height();
		var remainder = fullContainerHeight - questionContainerHeight;
		var answers = $('.answer-container');
		answers.css('height', remainder/2);
	},
	verticallyCenter: function() {
		var containers = $('.answer-container');
		containers.each(function(i, element) {
			var containerHeight = $(element).height();
			var answer = $(element).find('.answer');
			var answerHeight = answer.height();
			var margin = (containerHeight - answerHeight)/2;
			answer.css('margin-top', margin);
		});
	}
});

export default LessonsMultipleChoiceView;