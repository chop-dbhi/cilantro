---
layout: page
title: "Install & Setup"
category: ref
date: 2013-06-06 16:36:26
---

## Configuration

### JavaScript

Define the RequireJS configuration options:

```javascript
var require = {
    baseUrl: '/path/to/scripts'
};
```

Define the base Cilantro configuration options:

```javascript
var cilantro = {
    url: '/serrano/compatible/endpoint/',
    autoload: true,
    ui: {
        main: '#main'
    }
};
```

Define a `main.js` to setup the Cilantro routes. This makes Cilantro aware of which URLs is has control over and what to show on each one. Views will be rendered and appended to the element defined by the `cilantro.ui.main` selector when their corresponding routes are navigated to.

```javascript
require(['cilantro.ui'], function(c) {
    c.router.register([{
        id: 1,
        route: 'workspace/',
        view: new c.WorkspaceWorkflow
    }, {
        id: 2,
        route: 'query/',
        view: new c.ui.QueryWorkflow
    }, {
        id: 3,
        route: 'results/',
        view: new c.ResultsWorkflow
    }]);

    c.Backbone.history.start({pushState: true});
});
```

### HTML

Define a simple HTML file:

```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width">
        <title>Hello Cilantro!</title>
    </head>
    <body>
        <div id="main></div>
    </body>
</html>
```

Add the require.js script tag right before the closing `</body>` tag. Set the [`data-main` attribute](http://requirejs.org/docs/api.html#jsfiles) to load the main.js (omitting the .js) relative to the `baseUrl` setting above:

```html
<script data-main="main" src="/path/to/require.js"></script>
```

### Optional

Although not technically required, it is highly recommended you include the default Cilantro stylesheet. Put this right before the closing `</head>` tag:

```html
<link rel=stylesheet href="/path/to/cilantro.css">
```
