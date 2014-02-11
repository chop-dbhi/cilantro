define ->

    getFieldType = (model) ->
        type = model.get('simple_type')

        if model.get('enumerable') or type is 'boolean'
            return 'choice'
        else if type in ['number', 'datetime', 'date', 'time']
            return type

    { getFieldType }
