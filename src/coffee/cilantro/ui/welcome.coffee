define [
    'underscore'
    'marionette'
    'tpl!templates/welcome.html'
], (_, Marionette, templates...) ->

    templates = _.object ['welcome'], templates


    class Welcome extends Marionette.ItemView
        className: 'welcome'

        template: templates.welcome


    { Welcome }
