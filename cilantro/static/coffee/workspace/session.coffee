    class SessionScope extends polling.Model
        url: App.urls.session.scope


    class ScopeView extends Backbone.View
        el: '#session-scope'

        initialize: ->
            @model.bind 'change', @render

        render: => @el.html @model.get('text') or ''


    class SessionPerspective extends polling.Model
        url: App.urls.session.perspective


    class PerspectiveView extends Backbone.View
        el: '#session-perspective'

        initialize: ->
            @model.bind 'change', @render

        render: =>
            @el.empty()
            for col in @model.get('header')
                @el.append "<li>#{col.name} <span class=\"info\">(#{col.direction})</span></li>"



