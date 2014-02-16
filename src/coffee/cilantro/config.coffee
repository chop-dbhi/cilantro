define [
    'jquery'
    './utils'
], ($, utils) ->


    defaultOptions =
        # Run in debug mode for additional logging and turn off other
        # various behaviors that impede development.
        debug: false

        # The root URL to the application. If falsy, default is '/'
        root: null

        # The endpoint used when the default session is opened.
        url: null

        # The credentials used when the default session is opened.
        credentials: null

        # The selector of the element views will be rendered within.
        main: '#cilantro-main'

        # Options for templates
        #
        # Keys represent the template names and the values compiled template
        # functions.
        templates: {}

        # Options for controls
        #
        # Keys represent the names of the controls and the value is either
        # a control class or a module name (that will be fetched on demand).
        #
        # Built-in controls:
        # - infograph: cilantro/ui/controls/infograph
        # - number: cilantro/ui/controls/number
        # - date: cilantro/ui/controls/date
        # - search: cilantro/ui/controls/search
        controls: {}

        # Options for components related to concepts.
        #
        # Components:
        # - form: options for ConceptForm, a ConceptForm subclass, a module name
        #
        # Hierarchy:
        # - defaults: override the default options for the component
        # - types: options specific to concept type
        # - instances: options specific to a specific concept instance
        concepts:

            # DEPRECATED, use instances.<pk>.form
            forms: null

            defaults: {}

            types: {}

            instances: {}

        # Options for components related to fields.
        #
        # Hierarchy:
        # - defaults: override the default options for the component
        # - types: options specific to field type
        # - instances: options specific to a specific field instance
        #
        # Shared:
        # - form: options for FieldForm, a FieldForm subclass, module name
        #   - chart: true (show), false (hide; default), options (show)
        #   - info: true (show), false (hide), null (hide if only field in concept)
        #   - stats: true (show; default), false (hide)
        #   - controls: options for default control or a Control subclass
        #
        # Instances:
        # - type: string explicitly defining an instance's type
        #
        fields:

            defaults:
                form:
                    controls: ['search']

            types:
                choice:
                    form:
                        controls: ['infograph']

                number:
                    form:
                        chart: true
                        controls: ['number']

                date:
                    form:
                        chart: true
                        controls: ['date']

                time:
                    form:
                        chart: true
                        controls: ['date']

                datetime:
                    form:
                        chart: true
                        controls: ['date']

            instances: {}


    class Config
        constructor: (options...) ->
            @options = $.extend(true, {}, defaultOptions, options...)

        get: (key, def) ->
            utils.getDotProp(@options, key, def)

        set: (key, value) ->
            utils.setDotProp(@options, key, value)


    { Config, defaultOptions }
