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

    templateCache = {}
    templateCacheCustom = {}

    # Creates a templateId based on the template functions moduleName
    makeTemplateId = (name) ->
        # Remove templates dir prefix
        name = name.replace(/^templates\//, '')
        # Strip off .html extension
        name = name.replace(/\.html$/, '')
        # Replace path separators with dots
        return name.replace('/', '.')

    for templateFunc in templates
        templateId = makeTemplateId(templateFunc._moduleName)
        templateFunc.templateId = templateId
        templateCache[templateId] = templateFunc

    get = (id) ->
        templateCacheCustom[id] or templateCache[id]

    set = (id, func) ->
        templateCacheCustom[id] = func


    { get, set }
