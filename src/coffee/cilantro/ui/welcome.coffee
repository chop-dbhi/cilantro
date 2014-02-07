define [
    'underscore'
    'marionette'
], (_, Marionette) ->

    class Welcome extends Marionette.ItemView
        className: 'welcome'

        template: 'welcome'


    { Welcome }
