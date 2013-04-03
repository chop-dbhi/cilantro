define [
    '../core'
    'inputio'
    'tpl!templates/views/text-input.html'
    'tpl!templates/views/select-input.html'
    'tpl!templates/views/typeahead-input.html'
], (c, templates...) ->

    templates = c._.object ['text', 'select', 'typeahead'], templates


    class Input extends c.Marionette.ItemView


    class TextInput extends Input
        template: templates.text



    class SelectInput extends Input
        template: templates.select



    class TypeaheadInput extends Input
        template: templates.typeahead



    { TextInput, SelectInput, TypeaheadInput }
