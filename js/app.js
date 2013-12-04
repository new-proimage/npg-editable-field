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
    displayBinding: 'controller.content',
    InputView: Ember.TextField.extend(NPG.EventMixin, {
      attributeBindings: ['autofocus'],
      autofocus: true,
      valueBinding: 'parentView.controller.content',
      finish: 'finish',
      cancel: 'cancel'
    })
  });
  NPG.CheckboxMixin = Ember.Mixin.create({
    displayBinding: 'controller.content',
    InputView: Ember.Checkbox.extend(NPG.EventMixin, {
      checkedBinding: 'parentView.controller.content'
    })
  });
  NPG.SelectMixin = Ember.Mixin.create({
    displayBinding: 'controller.content.value',
    valueDidChange: function () {
      if (this.get('controller') !== null && this.get('controller.content.value') === null) {
        Ember.set(this.get('controller.content'), 'value', this.get('controller.content.options.firstObject'));
      }
    }.observes('controller.content.value'),
    InputView: Ember.Select.extend(NPG.EventMixin, {
      contentBinding: 'parentView.controller.content.options',
      valueBinding: 'parentView.controller.content.value'
    })
  });

  NPG.EditableController = Ember.Controller.extend({
    isEditing: false,
    onEditingDidChange: function () {
      var hostingController = this.get('hostingController'),
          actionName = this.get('afterEditHandler');
      if (!this.get('isEditing') && this.get('content') !== this.get('cache')) {
        hostingController.send(actionName, this.get('content'))
      }
    }.observes('isEditing'),
    actions: {
      edit: function () {
        if (!this.get('isEditing')) {
          this.set('isEditing', true);
          this.set('cache', Ember.copy(this.get('content')));
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

  /**
   * Editable component is the container view with registered helper
   * which creates the same intuitive behavior experience as an
   * Ember.Component however with minor deviations.
   * Editable Field is a container view which chooses the type
   * of the editor depending on the type of the content
   * that it is provided.
   *
   * Editable Field currently supports 3 types of editing:
   * - regular input fields for the types of string and numbers
   * - checkbox field for the types of boolean values
   * - select (combobox) field for the object with properties {value: null, options: []}
   *
   * API
   * @param {string|number|boolean|object}  content     The underlying model of the editable field
   * @param {string}                        afterEdit   Name of the handler in the hosting controller to be invoked whenever the editing has occurred
   */
  NPG.EditableField = Ember.ContainerView.extend({
    init: function () {
      this._super.apply(this, arguments);
      var that = this;
      this.set('controller', NPG.EditableController.create({
        content: that.get('content'),
        afterEditHandler: that.get('afterEdit'),
        hostingController: that.get('parentView.controller')
      }));
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
        controllerBinding: 'parentView.controller'
      });
    }.property('content'),
    doubleClick: function () {
      this.get('controller').send('edit');
    }
  });

  Ember.Handlebars.helper('editable-field', NPG.EditableField);

})();