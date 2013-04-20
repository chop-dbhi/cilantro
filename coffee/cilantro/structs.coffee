define [
    './core'
], (c) ->


    class Index extends c.Backbone.Model


    class Indexes extends c.Backbone.Collection
        model: Index


    class Datum extends c.Backbone.Model
        constructor: (attrs, options={}) ->
            if not (index = options.index)?
                index = new Index
            @index = index

            options.parse = true
            super(attrs, options)


    class DatumArray extends c.Backbone.Collection
        constructor: (attrs, options={}) ->
            if not (indexes = options.indexes)?
                indexes = new Indexes
            @indexes = indexes
            super(attrs, options)

        model: (value, options) =>
            index = @indexes.models[@length]
            new Datum
                value: value
            ,
                index: index


    class Series extends c.Backbone.Model
        constructor: (attrs, options={}) ->
            if not (indexes = options.indexes)?
                indexes = new Indexes

            @indexes = indexes
            @data = new DatumArray null,
                indexes: indexes

            options.parse = true
            super(attrs, options)

        parse: (resp, options) ->
            @data.reset(resp.values, options)
            return


    class SeriesArray extends c.Backbone.Collection
        constructor: (attrs, options={}) ->
            if not (indexes = options.indexes)?
                indexes = new Indexes
            @indexes = indexes
            super(attrs, options)

        model: (attrs, options) =>
            new Series attrs, indexes: @indexes


    class Frame extends c.Backbone.Model
        options:
            paginate: true
            paginateBy: 50

        constructor: (attrs, options={}) ->
            @indexes = new Indexes
            @series = new SeriesArray null,
                indexes: @indexes

            options.parse = true

            # Set the url for easily creating a data frame for remote data
            if options.url?
                @url = => options.url

            super(attrs, options)

        parse: (resp, options) ->
            @indexes.reset(resp.keys, options)
            @series.reset(resp.objects, options)
            return



    { Frame, Series, Datum, Index, Indexes }
