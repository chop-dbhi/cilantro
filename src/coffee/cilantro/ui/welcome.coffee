define [
    './core'
    'tpl!templates/welcome.html'
], (c, templates...) ->

    templates = c._.object ['welcome'], templates


    class Welcome extends c.Marionette.ItemView
        className: 'welcome'

        template: templates.welcome


    { Welcome }
