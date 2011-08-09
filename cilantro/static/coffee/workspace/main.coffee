define 'cilantro/workspace/main', ['cilantro/main'], ->

    App = window.App

    if not App
        window.App = App = {}

    App.hub = new PubSub

    class CollectionView extends Backbone.View
        initialize: ->
            @childViews = {}
            @collection.bind 'add', @add
            @collection.bind 'reset', @reset
            @collection.bind 'remove', @remove
            @collection.bind 'destroy', @destroy

        add: (model) =>
            # the view for this model has already been rendered, simply
            # re-attach it to the DOM
            if model.cid in @childViews
                view = @childViews[model.cid]
                # clear destroy timer from stack
                clearTimeout(view.dtimer)
            # create a new view representing this model
            else
                view = @childViews[model.cid] = (new @viewClass model: model).render()
            @el.append view.el

        # the collection has been reset, so create views for each new model
        reset: (collection, options) =>
            collection.each @add
            if options.initial then @el.animate opacity: 100, 500

        # detach the DOM element. this is intended to be temporary
        remove: (model) =>
            view = @childViews[model.cid]
            view.el.detach()
            # since this should be temporary, we set a timer to destroy the
            # element after some time to prevent memory leaks. note: this has no
            # impact on the underlying model
            view.dtimer = _.delay @destroy, 1000 * 10

        # remove the DOM element and all bound data completely
        destroy: (model) =>
            @childViews[model.cid].el.remove()


    class PollingCollection extends Backbone.Collection
        interval: 1000 * 10
        initialize: ->
            @poll()

        poll: ->
            setInterval =>
                @fetch()
            , @interval


    class PollingModel extends Backbone.Model
        interval: 1000 * 10
        initialize: ->
            @poll()

        poll: ->
            setInterval =>
                @fetch()
            , @interval


    class SessionScope extends PollingModel
        url: App.urls.session.scope


    class ScopeView extends Backbone.View
        el: '#session-scope'

        initialize: ->
            @model.bind 'change', @render

        render: => @el.html @model.get('text') or ''


    class SessionPerspective extends PollingModel
        url: App.urls.session.perspective


    class PerspectiveView extends Backbone.View
        el: '#session-perspective'

        initialize: ->
            @model.bind 'change', @render

        render: =>
            @el.empty()
            for col in @model.get('header')
                @el.append "<li>#{col.name} <span class=\"info\">(#{col.direction})</span></li>"


    class ActivityStream extends Backbone.Collection
    class SystemStatusStream extends Backbone.Collection


    class Reports extends PollingCollection
        url: App.urls.reports


    class ReportListItem extends Backbone.View
        el: '<li><strong role="name"></strong> - modified <span role="modified"></span></li>'

        elements:
            '[role=name]': 'name'
            '[role=modified]': 'modified'

        render: ->
            Synapse(@model).notify(@name).notify(@modified)


    class ReportList extends CollectionView
        el: '#reports ul'
        viewClass: ReportListItem


    $ ->

        App.reports = new Reports

        App.ReportList = new ReportList
            collection: App.reports

        App.reports.fetch()

        App.session =
            scope: new SessionScope
            perspective: new SessionPerspective 

        App.SessionScope = new ScopeView
            model: App.session.scope

        App.SessionPerspective = new PerspectiveView
            model: App.session.perspective

        App.session.scope.fetch()
        App.session.perspective.fetch()
