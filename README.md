# Editable Field Component

## 1.Overview
Editable Field Component changes the display value to the edit mode depending on the type of the model.
It represents `div` displaying the given value but on double click it changes to input/select tag where user can
edit the content. The content is saved on hit of `Enter` key or lost of focus.
On `Esc` the previous value is restored.

The type of the editable field is deduced from the type of the passed model.

* Types `string` and `number` are converted into `<input type="text" />` field
* Type of `boolean` is converted into checkbox `<input type="checkbox" />`
* `Object` type in the format if `{value: null, options: []}` is converted into the `<select>` tag with given options. The selected value is bounded to the `value` property in the object.

## 2. Use
Editable Field is instantiated from Handlebars template:

    <script type="text/x-handlebars">
      {{editable-field}}
    </script>

## 3. API
Editable Field component accept the following properties upon instantiation

* {string|number|boolean|object}  `content`         The underlying model of the editable field
* {string}                        `afterEdit`       Name of the function in the hosted controller to be invoked when editing is finished successfully

        {{editable-field
            value=phrase
            afterEdit="renameHandler"
        }}
        

## 4. Credits

* Sergey N. Bolshchikov (New ProImage)
* Elad Bahur (New ProImage)
* Ilan Goldfeld (New ProImage)

## 5. License
The MIT License (MIT)

Copyright (c) 2013 New ProImage
