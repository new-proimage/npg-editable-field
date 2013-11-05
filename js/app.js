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
      }
    },
    keyPress: function (ev) {
      if (this.get('isEditing') && ev.keyCode === 13) {
        this.set('isEditing', false);
      }
    },
    focusOut: function () {
      if (this.get('isEditing')) {
        this.set('isEditing', false);
      }
    },
    onEditingChanged: Ember.observer(function () {
      if (!this.get('isEditing')) {
        this.sendAction('onRename', this.get('value'));
      }
    }, 'isEditing')
  });

})();