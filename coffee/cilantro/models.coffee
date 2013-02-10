define [
    './core'
    './models/field'
    './models/concept'
    './models/context'
    './models/view'
], (c, mods...) ->
	
    c._.extend {}, mods...
