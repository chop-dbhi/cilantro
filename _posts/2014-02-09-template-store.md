---
layout: page
title: "Template Store"
category: ref
order: 0
---

_Since 2.2.3_

The template store is a single access point for templates defined and used by views in Cilantro. Previously, templates would need to be included as module dependencies which would make available a reference to the compiled template in the module.


```javascript
define(['tpl!templates/welcome.html'], function(template) {

});
```

This approach has two problems: use of explicit paths to the template file and (as a result) no way to override the template being used. The template store solves this problem mapping each template path to an explicit name and providing a simple method for getting that template by name.

```javascript
define(['cilantro'], (c) {
    // Assume the 'templates/welcome.html' file is named 'welcome'
    var template = c.templates.get('welcome');
});
```

To solve the latter of the two problems above, templates can be set by name as well:

```javascript
define(['cilantro'], (c) {
    var template = _.template('<h1>Hello!</h1>');
    c.templates.set('welcome', template);
});
```

Using the RequireJS tpl plugin, the templates come pre-compiled so they can be set directly in the template store:

```javascript
define(['cilantro', 'tpl!myproject/templates/welcome.html'], (c, template) {
    c.templates.set('welcome', template);
});
```

_Since 2.2.7_

AMD module paths can be set directly on the template store and they will be fetched and stored immediately. This provides a cleaner approach when setting up the Cilantro configuration:

```javascript
var cilantro = {
    templates: {
        'welcome': 'tpl!myproject/templates/welcome.html'
    }
};
```

To handle the asynchronous nature of this approach, the template store now provides a `ready()` function that returns true if all remote templates have been fetched and false if some are still pending. A simple way to do something once all templates have been loaded is to use polling:

```javascript
defin(['cilantro'], function(c) {
    var id;

    id = setInterval(function() {
        if (c.templates.ready()) {
            clearTimeout(id);
            // do something...
        }
    }, 15);
});
```

This approach has been used in the `c.ready()` function which takes a callback and executes it once Cilantro deems itself "ready". This includes ensuring all the templates have been loaded.

### Marionette Integration

The template store has been integrated with Marionette, so that template names can used in view definitions.

```javascript
define(['marionette'], function(Marionette) {
    var WelcomeView = Marionette.ItemView.extend({
        template: 'welcome'
    });
});
```

This tells Marionette to find the template named `'welcome'` at runtime. This not only makes for cleaner view class definitions, but makes it possible for client applications to define custom templates prior to starting a session.
