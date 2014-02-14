/**
 * 2014-2-12: Modified for Cilantro to augment the module name as a property
 * on the returned compiled function.
 *
 * Adapted from the official plugin text.js
 *
 * Uses UnderscoreJS micro-templates : http://documentcloud.github.com/underscore/#template
 * @author Julien Cabanès <julien@zeeagency.com>
 * @version 0.3
 *
 * @license RequireJS text 0.24.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

define(['module', 'text', 'underscore'], function(module, text, _) {
	var settings = module.config() || {};

	return {
		/**
		 * Dynamically loads your module by using text! to require the content, and then return the results of _.template.
		 * @param name
		 * @param req
		 * @param onLoad
		 * @param config
		 */
		load: function(name, req, onLoad, config) {
			if (config.isBuild) {
				text.load.call(text, name, req, onLoad, config);
				return;
			}
			req([ 'text!' + name ], function(content) {
                var func =  content ?
                    _.template(content, undefined, settings) :
                    function() { return ''; };
                func._moduleName = name;
                onLoad(func);
			});
		},
		/**
		 * Used by the optimizer to compile your templates. Logs detailed error messages whenever an invalid template is
		 * encountered.
		 * @param pluginName
		 * @param moduleName
		 * @param write
		 * @param config
		 */
		write: function(pluginName, moduleName, write, config) {
			text.write.call(text, pluginName, moduleName, {
				asModule: function(name, contents) {
					contents = contents.substr(contents.indexOf('return') + 7);
					contents = contents.substr(0, contents.lastIndexOf(';') - 3);
					try {
						var template = _.template(eval(contents), undefined, settings);
						write.asModule(pluginName + "!" + moduleName,
							"define(function() { var func = " + template.source +
                                "; func._moduleName = '" +
                                moduleName + "'; return func; });");
					}
					catch (err) {
						console.error('~~~~~');
						console.error('FAILED TO COMPILE ' + pluginName + "!" + moduleName);
						console.error('Error:\t\t' + String(err));
						console.error('\n');
						if (err && err.source) {
							console.error('Error Source:\n');
							console.error(err.source);
							console.error('\n\n');
						}
						console.error('Original Contents:\n');
						console.error(contents);
						console.error('\n\n');
						throw err;
					}
				}
			}, config);
		}
	};
});
