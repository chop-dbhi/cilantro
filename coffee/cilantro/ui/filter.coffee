define [
    './core'
], (c) ->

    class Filter extends c.Marionette.ItemView
        className: 'filter'


    class NamedFilter extends c.Marionette.CollectionView
        className: 'named-filter'
        itemView: Filter


    { NamedFilter, Filter }
