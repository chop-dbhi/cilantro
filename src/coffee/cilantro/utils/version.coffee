define [

], ->

    validVersionRe = /^\d+\.\d+\.\d+$/

    # Remove any release levels such as 'alpha', 'b2', 'rc1'. Ensures the
    # version contains three points including major, minor and micro.
    cleanVersionString = (version='') ->
        stripped = version.replace(/[abrf].*$/g, '')
        fields = stripped.split('.')

        # zfill the right side, e.g. [2] => [2, 0, 0]. Empty strings
        # are replaced with zeros, thus '2.' is a valid version string
        for _, i in [0, 0, 0]
            fields[i] = fields[i] or 0

        # Ensure each point is a valid number and has exactly three points
        if not validVersionRe.test(cleaned = fields.join('.'))
            throw new Error("Bad version string: #{ version }")

        return cleaned

    # Converts a cleaned version string into an object of integers
    parseVersionString = (version) ->
        fields = cleanVersionString(version).split('.')
        major: parseInt(fields[0], 10)
        minor: parseInt(fields[1], 10)
        micro: parseInt(fields[2], 10)

    # Compares version v1 with v2. If v1 is greater than v2, 1 is returned. If
    # v1 is less than v2, -1 is returned, if v1 and v2 are equal 0 is returned.
    compareVersions = (v1, v2) ->
        v1 = parseVersionString(v1)
        v2 = parseVersionString(v2)

        switch
            when v1.major > v2.major then return 1
            when v1.major < v2.major then return -1

        switch
            when v1.minor > v2.minor then return 1
            when v1.minor < v2.minor then return -1

        switch
            when v1.micro > v2.micro then return 1
            when v1.micro < v2.micro then return -1

        return 0

    versionIsEqual = (v1, v2) -> compareVersions(v1, v2) is 0
    versionIsGt = (v1, v2) -> compareVersions(v1, v2) is 1
    versionIsGte = (v1, v2) -> compareVersions(v1, v2) > -1
    versionIsLt = (v1, v2) -> compareVersions(v1, v2) is -1
    versionIsLte = (v1, v2) -> compareVersions(v1, v2) < 1
    versionInRange = (v1, v2, v3) -> versionIsGte(v1, v2) and versionIsLte(v1, v3)

    {
        cleanVersionString
        parseVersionString
        compareVersions
        versionIsEqual
        versionIsGt
        versionIsGte
        versionIsLt
        versionIsLte
        versionInRange
    }
