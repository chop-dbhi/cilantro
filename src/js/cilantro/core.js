/* global define */

define([
    'underscore',
    'backbone',
    './config',
    './channels',
    './utils',
    'plugins/js',
    'plugins/jquery-ajax-queue',
    // Conditional inclusion of json2 (for ie7)
    JSON === undefined ? 'json2' : null
], function(_, Backbone, config, channels, utils) {

    var cilantro = {
        // Version of cilantro
        version: '2.3.6',

        // Defines the minimum version and maximum version Serrano that this version
        // of Cilantro is 100% compatible with. While Cilantro will attempt to run
        // normally despite the version number received from the server, the user
        // will be warned if no version number is found or if it is less than this
        // minimum to prepare them in the case of missing or broken functionality.
        minSerranoVersion: '2.0.16',
        maxSerranoVersion: '2.3.8',

        // Returns the current session's Serrano version. If there is no
        // active session or version defined, the absolute minimum is returned.
        getSerranoVersion: function() {
            if (this.session) {
                return this.utils.cleanVersionString(this.session.version);
            }
        },

        // Returns a boolean as to whether the current Serrano version is
        // supported relative to the min and max.
        isSupported: function(version) {
            var minVersion = this.minSerranoVersion,
                maxVersion = this.maxSerranoVersion,
                serranoVersion = this.getSerranoVersion();

            // Cilantro may support a version of Serrano greater than the
            // current one being accessed.
            if (utils.versionIsLt(serranoVersion, maxVersion)) {
                maxVersion = serranoVersion;
            }

            return utils.versionInRange(version, minVersion, maxVersion);
        },

        // Initialize the session manager and default configuration
        config: new config.Config(this.cilantro),

        // Attach commonly used utilities
        utils: utils,
    };

    // Give the cilantro object events!
    _.extend(cilantro, Backbone.Events, channels);

    return cilantro;
});
