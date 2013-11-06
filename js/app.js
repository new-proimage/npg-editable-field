(function () {

  window.NPG = Ember.Application.create();

  NPG.ApplicationController = Ember.Controller.extend({
    phrase: 'Hello Sergey',
    actions: {
      renameHandler: function (newVal) {
        console.log(newVal);
      }
    }
  });

  NPG.EditableFieldComponent = Ember.Component.extend({
    init: function () {
      if (!this.get('explicitEdit')) {
        this.on('doubleClick', function () {
          this.send('edit');
        });
      }
      return this._super();
    },
    classNames: ['editable-field'],
    isEditing: false,
    actions: {
      edit: function () {
        if (!this.get('isEditing')) {
          this.set('isEditing', true);
          this.set('cache', this.get('value'));
        }
      },
      finish: function () {
        this.set('isEditing', false);
      },
      cancel: function () {
        this.set('value', this.get('cache'));
        this.set('isEditing', false);
      }
    },
    inputView: Ember.TextField.extend({
      attributeBindings: ['autofocus'],
      autofocus: true,
      keyDown: function (ev) {
        // esc
        if (ev.keyCode === 27) {
          this.sendAction('cancel');
        }
        // enter
        if (ev.keyCode === 13) {
          this.sendAction('finish');
        }
      },
      focusOut: function () {
        this.sendAction('finish');
      }
    }),
    onEditingChanged: Ember.observer(function () {
      if (!this.get('isEditing') && this.get('value') !== this.get('cache')) {
        this.sendAction('afterEdit', this.get('value'));
      }
    }, 'isEditing')
  });

})();