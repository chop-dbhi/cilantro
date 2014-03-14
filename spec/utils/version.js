/* global define, describe, it, expect */

define(['cilantro'], function(c) {

    describe('Utils', function() {

        describe('cleanVersionString', function() {

            it('should return 0.0.0 for empty version', function() {
                expect(c.utils.cleanVersionString()).toBe('0.0.0');
            });


            it('should throw an error when version is invalid', function() {
                expect(function() {
                    c.utils.cleanVersionString('version1');
                }).toThrow();
            });

            it('should strip off release levels', function() {
                expect(c.utils.cleanVersionString('1.2.3alpha')).toBe('1.2.3');
                expect(c.utils.cleanVersionString('1.2.3b2')).toBe('1.2.3');
                expect(c.utils.cleanVersionString('1.2.rc1')).toBe('1.2.0');
                expect(c.utils.cleanVersionString('1.2.1final')).toBe('1.2.1');
            });

            it('should zero fill to right', function() {
                expect(c.utils.cleanVersionString('1')).toBe('1.0.0');
                expect(c.utils.cleanVersionString('1.2')).toBe('1.2.0');
                expect(c.utils.cleanVersionString('0.9')).toBe('0.9.0');
            });

        });

        describe('cleanVersionString', function() {

            it('should throw an error when version is invalid', function() {
                expect(function() {
                    c.utils.parseVersionString('version1');
                }).toThrow();
            });

            it('should include major, minor, and micro levels', function() {
                var version = c.utils.parseVersionString('2.6.19');

                expect(version.major).toBe(2);
                expect(version.minor).toBe(6);
                expect(version.micro).toBe(19);
            });

        });

        describe('compareVersions', function() {

            it('should throw an error when either version is invalid', function() {
                expect(function() {
                    c.utils.compareVersions('version1', '1.0.0');
                }).toThrow();

                expect(function() {
                    c.utils.compareVersions('1.0.0', 'version1');
                }).toThrow();
            });

            it('should return 1 when v1 > v2', function() {
                expect(c.utils.compareVersions('0.0.1', '0.0.0')).toBe(1);
            });

            it('should return -1 when v1 < v2', function() {
                expect(c.utils.compareVersions('1.0.0', '2.0.0')).toBe(-1);
            });

            it('should return 0 when v1 == v2', function() {
                expect(c.utils.compareVersions('1.0.1', '1.0.1')).toBe(0);
                expect(c.utils.compareVersions('0.0.0', '0.0.0')).toBe(0);
            });

        });

        describe('versionIsEqual', function() {

            it('should return true when v1 == v2', function() {
                expect(c.utils.versionIsEqual('1.0.0', '1.0.0')).toBe(true);
            });

            it('should return false when v1 != v2', function() {
                expect(c.utils.versionIsEqual('1.0.0', '0.0.0')).toBe(false);
            });

        });

        describe('versionIsGt', function() {

            it('should return true when v1 > v2', function() {
                expect(c.utils.versionIsGt('1.0.0', '0.0.0')).toBe(true);
            });

            it('should return false when v1 <= v2', function() {
                expect(c.utils.versionIsGt('1.0.0', '1.0.0')).toBe(false);
                expect(c.utils.versionIsGt('0.0.0', '1.0.0')).toBe(false);
            });

        });

        describe('versionIsGte', function() {

            it('should return true when v1 >= v2', function() {
                expect(c.utils.versionIsGte('1.0.0', '1.0.0')).toBe(true);
                expect(c.utils.versionIsGte('1.0.0', '0.0.0')).toBe(true);
            });

            it('should return false when v1 < v2', function() {
                expect(c.utils.versionIsGte('0.0.0', '1.0.0')).toBe(false);
            });

        });

        describe('versionIsLt', function() {

            it('should return true when v1 < v2', function() {
                expect(c.utils.versionIsLt('0.0.0', '1.0.0')).toBe(true);
            });

            it('should return false when v1 >= v2', function() {
                expect(c.utils.versionIsLt('1.0.0', '1.0.0')).toBe(false);
                expect(c.utils.versionIsLt('1.0.0', '0.0.0')).toBe(false);
            });

        });

        describe('versionIsLte', function() {

            it('should return true when v1 <= v2', function() {
                expect(c.utils.versionIsLte('1.0.0', '1.0.0')).toBe(true);
                expect(c.utils.versionIsLte('0.0.0', '1.0.0')).toBe(true);
            });

            it('should return false when v1 > v2', function() {
                expect(c.utils.versionIsLte('1.0.0', '0.0.0')).toBe(false);
            });

        });

        describe('versionInRange', function() {

            it('should return true when v1 in [v2, v3]', function() {
                expect(c.utils.versionInRange('1.0.0', '1.0.0', '2.0.0')).toBe(true);
                expect(c.utils.versionInRange('1.1.9', '1.0.0', '2.0.0')).toBe(true);
                expect(c.utils.versionInRange('2.0.0', '1.0.0', '2.0.0')).toBe(true);
            });

            it('should return false when v1 not in [v2, v3]', function() {
                expect(c.utils.versionInRange('0.0.1', '1.0.0', '2.0.0')).toBe(false);
                expect(c.utils.versionInRange('3.0.1', '1.0.0', '2.0.0')).toBe(false);
            });

        });

    });

});
