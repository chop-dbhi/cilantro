define(['cilantro'], function(c) {

    describe('linkParser', function() {

        it('should create a element and set href', function() {
            var href = 'http://www.example.com/api/';
            expect(c.utils.linkParser(href).href).toBe(href);
        });

    });

    describe('alertUrlParams', function() {

        it('should return unchanged with no optional arguments', function() {
            var href = 'http://www.example.com/?key1=param1&key2=param2&key3=param3';
            expect(c.utils.alterUrlParams(href)).toBe(href);
        });

        it('should augment existing params with arguments', function() {
            var href = 'http://www.example.com/?key1=param1',
                expected_href = 'http://www.example.com/?key1=param1&key2=param2&key3=param3';
            expect(c.utils.alterUrlParams(href, 'key2', 'param2', 'key3', 'param3')).toBe(expected_href);
        });

        it('should set default if no param is set for key', function() {
            var href = 'http://www.example.com/?key1=param1',
                expected_href = 'http://www.example.com/?key1=param1&key2=param2&key3=';
            expect(c.utils.alterUrlParams(href, 'key2', 'param2', 'key3')).toBe(expected_href);
        });

    });
});
