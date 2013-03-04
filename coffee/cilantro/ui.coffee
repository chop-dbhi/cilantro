# This extends cilantro and attached libraries with UI-related components
define [
	'cilantro'
    './ui/concept'
    './ui/field'
    './ui/charts'
    './ui/filter'
    './ui/controls'
    './ui/workflows'
], (c, mods...) ->

    c.ui = c._.extend {}, mods...
    return c
