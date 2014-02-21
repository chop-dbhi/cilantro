define [
    'jquery'
    'marionette'
    '../core'
    './notify'
    './templates'
    './controls'
    './dom'
    'bootstrap'
    'plugins/bootstrap-datepicker'
    'plugins/jquery-ui'
    'plugins/jquery-easing'
    'plugins/jquery-panels'
    'plugins/jquery-scroller'
    'plugins/jquery-stacked'
], ($, Marionette, c, notify, templates, controls, dom) ->

    # Initialize notification stream and append it to the body
    stream = new notify.Notifications
        id: 'cilantro-notifications'

    $('body').append(stream.render().el)

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

    # Set configuration options for corresponding APIs
    templates.set(c.config.get('templates', {}))
    controls.get(c.config.get('controls', {}))

    # Add references public API
    c.notify = stream.notify
    c.templates = templates
    c.controls = controls
    c.dom = dom

    return c
