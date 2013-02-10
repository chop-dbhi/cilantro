# This extends cilantro and attached libraries with UI-related components
define [
	'./core'
	'./ui/views'
	'./ui/regions'
	'./ui/layouts'
], (c, views, regions, layouts) ->

    c.ui = { views, regions, layouts }
    return c
