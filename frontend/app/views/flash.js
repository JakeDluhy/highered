import Ember from 'ember';
import FlashController from '../objects/flash-controller';

var FlashView = Ember.View.extend({
  classNameBindings: ["isNotice", "isWarning", "isError"],
  isNoticeBinding: "content.isNotice",
  isWarningBinding: "content.isWarning",
  isErrorBinding: "content.isError",

  didInsertElement: function() {
    this.$("#message").hide();
    return FlashController.set("view", this);
  },

  show: function(content, callback) {
    this.set('content', content);
    return this.$("#message").css({
      top: "-40px"
    }).animate({
      top: "+=100",
      opacity: "toggle"
    }, 500, callback);
  },

  hide: function(callback) {
    return this.$("#message").css({
      top: "0px"
    }).animate({
      top: "-39px",
      opacity: "toggle"
    }, 500, callback);
  }
});

export default FlashView;