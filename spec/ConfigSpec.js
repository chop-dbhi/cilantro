define(['cilantro'], function(c) {

    describe('Config get option', function() {
      
        beforeEach(function() {
            c.config = {
                url: 'http://localhost:8000/api/',
                defaults: {
                    view: {
                        ordering: [1]
                    },
                    context: {}
                }
            };
        });
        
        it('should return the base url', function() {
            expect(c.getOption('url')).toBe('http://localhost:8000/api/');
        });

        it('should get a nested option', function() {
            expect(c.getOption('defaults.view.ordering.0')).toBe(1);
        });

        it('should return undefined for missing options', function() {
            expect(c.getOption('foo.bar.baz')).toBeUndefined();
        });
    });


    describe('Config set option', function() {
        c.config = {
            url: 'http://localhost:8000/api/',
            defaults: {
                view: {
                    ordering: [1]
                },
                context: {}
            }
        };
        
        it('should set an existing (nested) option', function() {
            c.setOption('defaults.context.type', 'or')
            expect(c.getOption('defaults.context.type')).toBe('or');
        });

        it('should set a non-existing option (and create objects along the way)', function() {
            c.setOption('foo.bar.baz', 1)
            expect(c.getOption('foo.bar.baz')).toBe(1);
        });

    });
});
