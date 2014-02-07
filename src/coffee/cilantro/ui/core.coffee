define [
    'marionette'
    '../core'
    './templates'
    './notify'
    'bootstrap'
    'plugins/bootstrap-datepicker'
    'plugins/jquery-ui'
    'plugins/jquery-easing'
    'plugins/jquery-panels'
    'plugins/jquery-scroller'
    'plugins/jquery-stacked'
], (Marionette, c, templates, notify) ->

    # Add reference to template cache access methods
    c.templates = templates

    defaultLoadTemplate = Marionette.TemplateCache::loadTemplate
    defaultCompileTemplate = Marionette.TemplateCache::compileTemplate

    # See: https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.templatecache.md#override-template-retrieval
    Marionette.TemplateCache::loadTemplate = (templateId) ->
        if not (func = templates.get(templateId))
            func = defaultLoadTemplate.call(this, templateId)
        return func

    # Prevent re-compiling already compiled templates
    Marionette.TemplateCache::compileTemplate = (template) ->
        if typeof template isnt 'function'
            template = defaultCompileTemplate(template)
        return template


    # Initialize notification stream and append it to the main element
    stream = new notify.Notifications
        id: 'notifications'

    $(c.config.get('main'))
        .css('position', 'relative')
        .append(stream.render().el)

    # Attach primary method for creating notifications
    c.notify = stream.notify

    return c
