define ->

    # Utility for parsing links
    # http://stackoverflow.com/a/6644749/407954
    # https://developer.mozilla.org/en-US/docs/Web/API/window.location
    linkParser = (href) ->
        a = document.createElement('a')
        a.href = href
        return a


    # Augments/changes a URL's query parameters. Takes a URL and a variable
    # number of param pairs.
    alterUrlParams = (href, args...) ->
        a = linkParser(href)

        # Keep the order of the keys
        keys = []
        params = {}

        for s in a.search.substr(1).split('&')
            [k, v] = s.split('=')
            if k
                params[k] = v
                keys.push(k)

        # Update the params hash with parameters
        for arg, i in args
            if i % 2 is 0
                p = arg
                if not params[p]? then keys.push(p)
            else
                params[p] = arg

        # Rebuild search params
        search = []
        for key in keys
            if not (value = params[key])?
                value = ''
            search.push "#{ key }=#{ value }"

        a.search = "?#{ search.join('&') }"
        return a.href


    { linkParser, alterUrlParams }
