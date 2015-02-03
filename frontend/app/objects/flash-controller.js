import Ember from 'ember';
import FlashQueue from './flash';

var FlashController = Ember.Object.create({
  content: null,
  clearContent: function(content, view) {
    return view.hide(function() {
      return FlashQueue.removeObject(content);
    });
  }
});

FlashController.addObserver('content', function() {
  if (this.get("content")) {
    if (this.get("view")) {
      this.get("view").show(this.get('content'));
      return setTimeout(this.clearContent, 4000, this.get("content"), this.get("view"));
    }
  } else {
    return FlashQueue.contentChanged();
  }
});

export default FlashController;