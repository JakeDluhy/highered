import Ember from 'ember';
import FlashController from './flash-controller';

var FlashMessage = Ember.Object.extend({
  type: "notice",
  message: null,
  isNotice: (function() {
    return this.get("type") === "notice";
  }).property("type").cacheable(),
  isWarning: (function() {
    return this.get("type") === "warning";
  }).property("type").cacheable(),
  isError: (function() {
    return this.get("type") === "error";
  }).property("type").cacheable()
});

var FlashQueue = Ember.ArrayProxy.create({
  content: [],
  contentChanged: function() {
    var current;
    current = FlashController.get("content");
    if (current !== this.objectAt(0)) {
      return FlashController.set("content", this.objectAt(0));
    }
  },
  pushFlash: function(type, message) {
    return this.pushObject(FlashMessage.create({
      message: message,
      type: type
    }));
  }
});

FlashQueue.addObserver('length', function() {
  return this.contentChanged();
});

export default FlashQueue;