# Editable Field Component

## 1.Overview
Editable Field Component is based on `Ember.Component`. It represents `div` displaying the given value but on double
click it changes to input tag where user can edit the content. The content is saved on hit of `Enter` key or lost of focus.
On `Esc` the previous value is restored.

## 2. Use
Editable Field is instantiated from Handlebars template:

    <script type="text/x-handlebars">
      {{editable-field}}
    </script>

## 3. API
Editable Field component accept the following properties upon instantiation

* {string}  `value`         Current value of the displayed text
* {string}  `onRename`      Name of the function in the hosted controller to be invoked when rename occurred passing the updated value
* {boolean} `explicitEdit`  Explicit edit, if `true`, adds edit button next to the text; otherwise edit mode is invoked by double click


        {{editable-field
            value=phrase
            onRename="renameHandler"
            explicitEdit=true
        }}
        

## 4. Credits

* Sergey N. Bolshchikov (New ProImage)
* Ilan Goldfeld (New ProIamge)

## 5. License
The MIT License (MIT)

Copyright (c) 2013 New ProImage
