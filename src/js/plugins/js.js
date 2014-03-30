/* global define */

define(function() {
    if (!String.prototype.trim) {
        String.prototype.ltrim = function() {
            return this.replace(/^\s+/, '');
        };

        String.prototype.rtrim = function() {
            return this.replace(/\s+$/, '');
        };

        String.prototype.trim = function() {
            this.ltrim().rtrim();
        };
    }
});
