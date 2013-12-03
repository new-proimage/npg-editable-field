(function () {

  window.NPG = Ember.Application.create({
    phrase: 'Hello Sergey',
    fruits: {
      options: ['oranges', 'apples', 'peaches'],
      value: null
    },
    isHome: true
  });

  NPG.ApplicationController = Ember.Controller.extend({
    actions: {
      renameHandler: function (newVal) {
        console.log(newVal);
      }
    }
  });


  NPG.EventMixin = Ember.Mixin.create({
    /*
    The instanceof check is a HACK due to inconsistency
    of Ember built-in views API. TextField view inherits from the
    Ember.Component whist other view like Ember.Select or Ember.Checkbox
    extend Ember.View.
    This leads to misuse of controller and their methods as well.
     */
    keyDown: function (ev) {
      // esc
      if (ev.keyCode === 27) {
        if (this instanceof Ember.Component) {
          this.sendAction('cancel');
        }
        else {
          this.get('controller').send('cancel');
        }
      }
      // enter
      if (ev.keyCode === 13) {
        if (this instanceof Ember.Component) {
          this.sendAction('finish');
        }
        else {
          this.get('controller').send('finish');
        }
      }
    },
    focusOut: function () {
      if (this instanceof Ember.Component) {
        this.sendAction('finish');
      }
      else {
        this.get('controller').send('finish');
      }
    }
  });
  NPG.TextMixin = Ember.Mixin.create({
    displayBinding: 'content',
    InputView: Ember.TextField.extend(NPG.EventMixin, {
      attributeBindings: ['autofocus'],
      autofocus: true,
      valueBinding: 'parentView.content',
      finish: 'finish',
      cancel: 'cancel'
    })
  });
  NPG.CheckboxMixin = Ember.Mixin.create({
    displayBinding: 'content',
    InputView: Ember.Checkbox.extend(NPG.EventMixin, {
      checkedBinding: 'parentView.content'
    })
  });
  NPG.SelectdMixin = Ember.Mixin.create({
    displayBinding: 'content.value',
    InputView: Ember.Select.extend(NPG.EventMixin, {
      contentBinding: 'parentView.content.options',
      valueBinding: 'parentView.content.value'
    })
  });

  NPG.EditableController = Ember.Controller.extend({
    isEditing: false,
    actions: {
      edit: function () {
        if (!this.get('isEditing')) {
          this.set('isEditing', true);
          this.set('cache', this.get('content'));
        }
      },
      finish: function () {
        this.set('isEditing', false);
      },
      cancel: function () {
        this.set('content', this.get('cache'));
        this.set('isEditing', false);
      }
    }
  });

  NPG.EditableField = Ember.ContainerView.extend({
    init: function () {
      this._super.apply(this, arguments);
      this.set('controller', NPG.EditableController.create());
    },
    classNames: ['editable-field'],
    childViews: ['editableView'],
    editableView: function () {
      var data = this.get('content'), mixin;
      if (typeof data === 'boolean') {
        mixin = NPG.CheckboxMixin;
      }
      else if (typeof data === 'object' && data.options !== void 0 && data.value !== void 0) {
        mixin = NPG.SelectMixin;
      }
      else {
        mixin = NPG.TextMixin;
      }
      return Ember.View.createWithMixins(mixin, {
        templateName: 'editable-view',
        contentBinding: 'parentView.content',
        controllerBinding: 'parentView.controller'
      });
    }.property('content'),
    doubleClick: function () {
      this.get('controller').send('edit');
    }
  });

  Ember.Handlebars.helper('editable-field', NPG.EditableField);



//  NPG.EditableFieldComponent = Ember.Component.extend({
//    init: function () {
//      if (!this.get('explicitEdit')) {
//        this.on('doubleClick', function () {
//          this.send('edit');
//        });
//      }
//      return this._super();
//    },
//    classNames: ['editable-field'],
//    isEditing: false,
//    actions: {
//      edit: function () {
//        if (!this.get('isEditing')) {
//          this.set('isEditing', true);
//          this.set('cache', this.get('data'));
//        }
//      },
//      finish: function () {
//        this.set('isEditing', false);
//      },
//      cancel: function () {
//        this.set('data', this.get('cache'));
//        this.set('isEditing', false);
//      }
//    },
//    inputView: Ember.TextField.extend({
//      attributeBindings: ['autofocus'],
//      autofocus: true,
//      keyDown: function (ev) {
//        // esc
//        if (ev.keyCode === 27) {
//          this.sendAction('cancel');
//        }
//        // enter
//        if (ev.keyCode === 13) {
//          this.sendAction('finish');
//        }
//      },
//      focusOut: function () {
//        this.sendAction('finish');
//      }
//    }),
//    onEditingChanged: Ember.observer(function () {
//      if (!this.get('isEditing') && this.get('value') !== this.get('cache')) {
//        this.sendAction('afterEdit', this.get('value'));
//      }
//    }, 'isEditing')
//  });

})();