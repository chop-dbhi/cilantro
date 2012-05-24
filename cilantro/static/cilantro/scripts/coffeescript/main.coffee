define [
    'environ'
    'jquery'
    'use!underscore'
    'use!backbone'
    'panels'
    'charts'
    'views'
    'serrano'
    'use!jquery.ui'
], (environ, $, _, Backbone, panels, Charts, views, Serrano) ->

    $ ->
        window.App = App = {}

        App.subnav = $ '#subnav .container-fluid'

        class DataFields extends Serrano.DataFields
            url: environ.absolutePath '/api/fields/'

        class DataConcepts extends Serrano.DataConcepts
            url: environ.absolutePath '/api/concepts/'

        class Distributions extends Serrano.Distributions
            url: environ.absolutePath '/api/distributions/'

        # Note, these instances are not plural since the `models` property is
        # actually the list of models..
        App.DataField = new DataFields
        App.DataConcept = new DataConcepts
        App.Distribution = new Distributions

        dataFiltersAccordian = new views.DataFiltersAccordian
            el: '#data-filters-accordian'
            collection: App.DataConcept

        # Lazily create the QueryViews
        App.DataConcept.on 'reset', (collection) ->
            collection.each (model, i) ->
                if model.get 'queryview'
                    new views.QueryView
                        model: model


        # Enable a simply registration mechanism for the various views on the
        # page. This enables extending the UI programatically.
        class View extends Backbone.View
            initialize: ->

            load: ->
                @area = @$el
                @area.fadeIn()

            unload: ->
                @area = @$el
                @area.hide()

            destroy: ->



        # Displays the users' saved components and their recent activity
        class Workspace extends View
            id: '#workspace-area'

            initialize: ->
                @area = @$el

                @activity = new views.Container
                @activity.$el.addClass 'span4'
                @activity.heading.text 'Activity'

                @queries = new views.Container
                @queries.$el.addClass 'span4'
                @queries.heading.text 'Queries'

                @area
                    .hide()
                    .appendTo('#main-area .inner')
                    .addClass('row-fluid')
                    .append(@activity.el, @queries.el)


        # 
        class Discover extends View
            id: '#discover-area'

            initialize: ->
                @area = @$el
                
                @area
                    .css('margin-left', '250px')
                    .appendTo('#main-area .inner')


        class Analyze extends View
            id: '#analyze-area'

            initialize: ->
                @area = @$el

                @toolbar = $('<ul>')
                    .addClass('nav pull-right')
                    .hide()
                    .appendTo(App.subnav)

                @addDistributionButton = $('<button>')
                    .addClass('btn')
                    .append('<i>')
                        .find('i')
                            .addClass('icon-signal')
                        .end()

                @area
                    .appendTo('#main-area .inner')
                    .addClass('row-fluid')
                    .sortable
                        items: '> .chart-container'
                        handle: '.heading'

                @toolbar
                    .append @addDistributionButton

                @addDistributionButton
                    .on 'click', (event) =>
                        view = new Charts.Distribution
                            collection: App.DataField
                        @area.append view.$el

            load: ->
                super
                @toolbar.fadeIn()

            unload: ->
                super
                @toolbar.hide()


        class Review extends View
            id: '#review-area'

            initialize: ->
                @$el.appendTo '#main-area .inner'



        class Router extends Backbone.Router
            # Initialize shared components
            initialize: ->

                # Bind all route-enabled links on the page and ensure they
                # stay in sync relative to all other links
                (appLinks = $('[data-route]'))
                    .on 'click', (event) ->
                        event.preventDefault()
                        App.router.navigate @pathname, trigger: true

                    .each (i, el) =>
                        page = $(el).data 'route'
                        links = appLinks.filter "[data-route=#{ page }]"
                        @on "route:#{ page }", ->
                            appLinks.parent().removeClass 'active'
                            links.parent().addClass 'active'

                # Initial modals
                $('.modal').modal show: false

        App.router = new Router

        App.views = {}
        App.loaded = []
        App.register = (route, name, view) ->
            App.views[name] = view
            @router.route route, name, =>
                # First route handler, perform initial steps
                if not App._routing
                    App._routing = true
                    # Unload existing views
                    (App.views[_name]?.unload() for _name in @loaded)
                    @loaded = []
                    # Defer to end of call stack
                    _.defer -> App._routing = false

                App.views[name]?.load()
                @loaded.push name


        workspace = new Workspace
        discover = new Discover
        analyze = new Analyze
        review = new Review

        App.register '', 'workspace', workspace
        App.register 'discover/', 'discover', discover
        App.register 'analyze/', 'analyze', analyze
        App.register 'review/', 'review', review

        # Start up the history
        Backbone.history.start pushState: true

        App.DataField.fetch()
        App.DataConcept.fetch()
        # App.Distribution.fetch()

        ###
        $('[data-toggle=chosen]').chosen
            allow_single_deselect: true

        $('[data-toggle=chosen-ajax]').each ->
            select = $(this)
            url = select.data('url')
            input = $('#' + select.attr('id') + '_chzn')
            select.ajaxChosen
                url: url
            , (resp) ->
                data = {}
                i = 0

                while i < resp.length
            </div>
        '
        ###

