# This extends cilantro and attached libraries with UI-related components
define [
    './cilantro'
    './cilantro/ui/concept'
    './cilantro/ui/field'
    './cilantro/ui/charts'
    './cilantro/ui/filter'
    './cilantro/ui/controls'
    './cilantro/ui/workflows'
], (c, mods...) ->

    c.ui = c._.extend {}, mods...
    return c
