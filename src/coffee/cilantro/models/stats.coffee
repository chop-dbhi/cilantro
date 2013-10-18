define [
    'underscore'
    'backbone'
], (_, Backbone) ->

    class StatModel extends Backbone.Model

    class StatCollection extends Backbone.Collection
        model: StatModel

        parse: (attrs) ->
            stats = []
            for key, value of attrs
                if key.slice(0, 1) is '_' then continue
                stats.push
                    key: key
                    value: value
            return stats

    { StatModel, StatCollection }
