define ->
    # IE <9
    if not String::trim
        String::ltrim = -> @replace /^\s+/, ''
        String::rtrim = -> @replace /\s+$/, ''
        String::trim = -> @ltrim().rtrim()
