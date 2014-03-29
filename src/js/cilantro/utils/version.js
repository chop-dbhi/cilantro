/* global define */

define([], function() {

    var validVersionRe = /^\d+\.\d+\.\d+$/;

    /*
     * Remove any release levels such as 'alpha', 'b2', 'rc1'. Ensures the
     * version contains three points including major, minor and micro.
     */
    var cleanVersionString = function(version) {
        if (!version) version = '';

        var stripped = version.replace(/[abrf].*$/g, '');
        var fields = stripped.split('.');

        // zfill the right side, e.g. [2] => [2, 0, 0]. Empty strings are
        // replaced with zeros, thus '2.' is a valid version string.
        for (var i = 0; i < 3; i++) {
            fields[i] = fields[i] || 0;
        }

        // Ensure each point is a valid number and has exactly three points.
        var cleaned;
        if (!validVersionRe.test(cleaned = fields.join('.'))) {
            throw new Error('Bad version string: ' + version);
        }

        return cleaned;
    };

    // Converts a cleaned version string into an object of integers
    var parseVersionString = function(version) {
        var fields = cleanVersionString(version).split('.');

        return {
            major: parseInt(fields[0], 10),
            minor: parseInt(fields[1], 10),
            micro: parseInt(fields[2], 10)
        };
    };

    /*
     * Compares version v1 with v2. If v1 is greater than v2, 1 is returned.
     * If v1 is less than v2, -1 is returned, if v1 and v2 are equal 0 is
     * returned.
     */
    var compareVersions = function(v1, v2) {
        v1 = parseVersionString(v1);
        v2 = parseVersionString(v2);

        switch (true) {
            case (v1.major > v2.major):
                return 1;
            case (v1.major < v2.major):
                return -1;
        }

        switch (true) {
            case (v1.minor > v2.minor):
                return 1;
            case (v1.minor < v2.minor):
                return -1;
        }

        switch (true) {
            case (v1.micro > v2.micro):
                return 1;
            case (v1.micro < v2.micro):
                return -1;
        }

        return 0;
    };

    var versionIsEqual = function(v1, v2) {
        return compareVersions(v1, v2) === 0;
    };

    var versionIsGt = function(v1, v2) {
        return compareVersions(v1, v2) === 1;
    };

    var versionIsGte = function(v1, v2) {
        return compareVersions(v1, v2) > -1;
    };

    var versionIsLt = function(v1, v2) {
        return compareVersions(v1, v2) === -1;
    };

    var versionIsLte = function(v1, v2) {
        return compareVersions(v1, v2) < 1;
    };

    var versionInRange = function(v1, v2, v3) {
        return versionIsGte(v1, v2) && versionIsLte(v1, v3);
    };

    return {
        cleanVersionString: cleanVersionString,
        parseVersionString: parseVersionString,
        compareVersions: compareVersions,
        versionIsEqual: versionIsEqual,
        versionIsGt: versionIsGt,
        versionIsGte: versionIsGte,
        versionIsLt: versionIsLt,
        versionIsLte: versionIsLte,
        versionInRange: versionInRange
    };
});
