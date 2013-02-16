define [
    '../core'
    'tpl!templates/views/field-stats.html'
], (c, templates...) ->

    templates = c._.object ['stats'], templates

    
    # Prettifies a key for display
    prettyKey = (key) ->
        key = key.replace(/[_\-\s]+/, ' ').trim()
        key.charAt(0).toUpperCase() + key.substr(1)


    # Prettifies a value for display
    prettyValue = (value) ->
        if c._.isNumber(value) then c.utils.prettyNumber(value) else value


    class FieldStats extends c.Marionette.ItemView
        tagName: 'ul'
        className: 'field-stats'
        template: templates.stats

        parseData: (data) ->
            stats = {}
            for key, value of data
                if key.slice(0, 1) is '_' then continue
                stats[prettyKey(key)] = prettyValue(value)
            return stats

        render: ->
            @isClosed = false

            @triggerMethod 'before:render', @
            @triggerMethod 'item:before:render', @

            @model.stats (data) =>
                template = @getTemplate()
                data = @parseData(data)
                html = c.Marionette.Renderer.render(template, data)
                @$el.html(html)
                @bindUIElements()

                @triggerMethod 'render', @
                @triggerMethod 'item:rendered', @

            return @


    { FieldStats }
