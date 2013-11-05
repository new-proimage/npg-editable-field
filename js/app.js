(function () {

  window.NPG = Ember.Application.create();

  NPG.ApplicationController = Ember.Controller.extend({
    phrase: 'Hello world',
    actions: {
      renameHandler: function (newVal) {
        console.log(newVal);
      }
    }
  });

  NPG.EditableFieldComponent = Ember.Component.extend({
    init: function () {
      Ember.TextField.reopen({
        attributeBindings: ['autofocus']
      });
      return this._super();
    },
    classNames: ['editable-field'],
    isEditing: false,
    doubleClick: function () {
      if (!this.get('isEditing')) {
        this.set('isEditing', true);
        this.set('cache', this.get('value'));
      }
    },
    keyPress: function (ev) {
      if (this.get('isEditing') && ev.keyCode === 13) {
        this.set('isEditing', false);
      }
    },
    keyDown: function (ev) {
      if (ev.keyCode === 27) {
        this.set('value', this.get('cache'));
        this.set('isEditing', false);
      }
    },
    focusOut: function () {
      if (this.get('isEditing')) {
        this.set('isEditing', false);
      }
    },
    onEditingChanged: Ember.observer(function () {
      if (!this.get('isEditing') && this.get('value') !== this.get('cache')) {
        this.sendAction('onRename', this.get('value'));
      }
    }, 'isEditing')
  });

})();