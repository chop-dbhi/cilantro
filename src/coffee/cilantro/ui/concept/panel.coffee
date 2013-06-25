define [
    '../core'
    './index'
    './search'
    'tpl!templates/concept/panel.html'
], (c, index, search, templates...) ->

    templates = c._.object ['panel'], templates


    # Extracts the number portion of a pixel string, e.g. '50px' => 50
    parsePixelString = (string) ->
        if (number = string.match(/\d+/)?[0])?
            return parseFloat(number)


    # Return the minimum height of the element. This is used as the
    # threshold for switching children to static positioning.
    getMinHeight = (elem) ->
        height = parsePixelString(c.$(elem).css('min-height'))
        if not height? then height = 0
        return height


    # Get the total scroll height of `elem` relative to the children
    getScrollHeight = (elem) ->
        total = 0
        $elem = c.$(elem)
        $elem.children().each (i, e) -> total += c.$(e).outerHeight(true)
        total - $elem.outerHeight()


    # Applies a class to adjacent siblings if the scroll position
    # is non-zero. If not adjacent siblings are present, the class will
    # applied to the parent which can provide an inner overlap (inset
    # box-shadow)
    toggleOverlay = (elem, className='overlay', classNameTop, classNameBottom) ->
        classNameTop ?= "#{ className }-top"
        classNameBottom ?= "#{ className }-bottom"

        $elem = c.$(elem)
        scrollTop = $elem.scrollTop()

        afterTop = scrollTop > 0
        beforeBottom = scrollTop < getScrollHeight($elem)

        if ($prev = $elem.prev())[0]?
            $prev.toggleClass(className, afterTop)
        else
            $elem.parent().toggleClass(classNameTop, afterTop)

        if ($next = $elem.next())[0]?
            $next.toggleClass(className, beforeBottom)
        else
            $elem.parent().toggleClass(classNameBottom, beforeBottom)


    class ConceptSearch extends search.ConceptSearch
        events:
            'typeahead:autocompleted input': 'autocomplete'

        autocomplete: (event, datum) ->
            c.publish c.CONCEPT_FOCUS, datum.id


    class ConceptPanel extends c.Marionette.Layout
        className: 'concept-panel'

        template: templates.panel

        regions:
            search: '.search-region'
            index: '.index-region'

        # Toggles the overlap class on adjacent siblings to show a relative
        # scroll position
        toggleOverlay: =>
            toggleOverlay(@index.$el, 'overlay')

        setHeight: ->
            # Since this is a relatively positioned element, the height will
            # be zero if the parent does not have a fixed height. If this is
            # the case, use the max-height of the parent or default to the
            # window height if no max-height has been defined. Remove
            # additional 10px to prevent being flush against the bottom edge.
            if not (height = parsePixelString(@$el.css('max-height')))?
                height = c.$(window).height() - @$el.offset().top - 10
            @$el.height(height)

        onRender: ->
            @index.show new index.ConceptIndex
                collection: @collection
                collapsable: false

            @search.show new ConceptSearch
                collection: @collection
                handler: (query, resp) =>
                    @index.currentView.filter(query, resp)

            # Update position on window resize
            c.$(window).on 'resize', =>
                @setHeight()

            @index.$el.on 'scroll', @toggleOverlay

            # TODO document
            # Defer focus of concept search until end of event loop
            c._.defer =>
                @search.currentView.ui.input.focus()
                @setHeight()
                @toggleOverlay()



    { ConceptPanel }
