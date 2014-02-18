define [
    'tpl!templates/context.html'
    'tpl!templates/count.html'
    'tpl!templates/notification.html'
    'tpl!templates/paginator.html'
    'tpl!templates/panel.html'
    'tpl!templates/search.html'
    'tpl!templates/welcome.html'

    'tpl!templates/accordian/group.html'
    'tpl!templates/accordian/item.html'
    'tpl!templates/accordian/section.html'

    'tpl!templates/base/error-overlay.html'

    'tpl!templates/button/select-option.html'
    'tpl!templates/button/select.html'

    'tpl!templates/charts/chart.html'
    'tpl!templates/charts/editable-chart.html'

    'tpl!templates/concept/columns-available-group.html'
    'tpl!templates/concept/columns-available-section.html'
    'tpl!templates/concept/columns-available.html'
    'tpl!templates/concept/columns-selected.html'
    'tpl!templates/concept/columns.html'
    'tpl!templates/concept/error.html'
    'tpl!templates/concept/form.html'
    'tpl!templates/concept/info.html'
    'tpl!templates/concept/panel.html'
    'tpl!templates/concept/workspace.html'

    'tpl!templates/context/actions.html'
    'tpl!templates/context/empty.html'
    'tpl!templates/context/info.html'
    'tpl!templates/context/item.html'
    'tpl!templates/context/tree.html'

    'tpl!templates/controls/infograph/bar.html'
    'tpl!templates/controls/infograph/layout.html'
    'tpl!templates/controls/infograph/toolbar.html'

    'tpl!templates/controls/range/layout.html'

    'tpl!templates/controls/select/layout.html'
    'tpl!templates/controls/select/list.html'

    'tpl!templates/controls/search/layout.html'
    'tpl!templates/controls/search/item.html'

    'tpl!templates/field/form-condensed.html'
    'tpl!templates/field/form.html'
    'tpl!templates/field/info.html'
    'tpl!templates/field/stats.html'

    'tpl!templates/query/delete-dialog.html'
    'tpl!templates/query/edit-dialog.html'
    'tpl!templates/query/item.html'
    'tpl!templates/query/list.html'
    'tpl!templates/query/loader.html'

    'tpl!templates/values/list.html'

    'tpl!templates/workflows/query.html'
    'tpl!templates/workflows/results.html'
    'tpl!templates/workflows/workspace.html'

], (templates...) ->

    # Built-in templates and application-defined templates
    templateCache = {}
    templateCacheCustom = {}

    # Derives a template id from the template's path. This is an internal
    # function that assumes the base directory is under templates/
    templatePathToId = (name) ->
        # Remove templates dir prefix, strip extension
        name.replace(/^templates\//, '').replace(/\.html$/, '')

    # Registers all built-in templates using the augmented _moduleName from
    # a modified version of the RequireJS tpl plugin.
    for templateFunc in templates
        templateId = templatePathToId(templateFunc._moduleName)
        templateFunc.templateId = templateId
        templateCache[templateId] = templateFunc

    # Templates can be registered as AMD modules which will be immediately
    # fetched to obtain the resulting compiled template function. This is
    # count of the number of pending AMD modules that have not been fetched.
    pendingRemotes = 0

    # Loads the remote template and adds it to the custom cache.
    loadRemoteTemplate = (id, module) ->
        pendingRemotes++

        require [module], (func) ->
            templateCacheCustom[id] = func
            pendingRemotes--
        , (err) ->
            pendingRemotes--

    # Handles the case when the registered function is *not* a function.
    _set = (id, func) ->
        switch (typeof func)
            when 'function'
                templateCacheCustom[id] = func
            when 'string'
                loadRemoteTemplate(id, func)
            else
                throw new Error('template must be a function or AMD module')

    # Get the template function by id. Checks the custom cache and falls back
    # to the built-in cache.
    get = (id) ->
        templateCacheCustom[id] or templateCache[id]

    # Sets a template in cache.
    set = (id, func) ->
        if typeof id is 'object'
            _set(key, func) for key, func of id
        else
            _set(id, func)
        return

    # Returns a boolean denoting if all AMD-based templates have been loaded.
    ready = ->
        pendingRemotes is 0

    { get, set, ready }
