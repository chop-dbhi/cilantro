{% load url from future %}

var App = {

    // Used for constructing URLs
    SCRIPT_NAME: '{{ request.META.SCRIPT_NAME }}',

    // Used for non-safe requests, also defined in `environ.js`
    CSRF_TOKEN: '{{ csrf_token }}',

    urls: {
        exporter: '{% url "serrano:exporter" %}',
        dataviews: '{% url "serrano:dataviews" %}',
        dataviewHistory: '{% url "serrano:dataview-history" %}',
        datacontexts: '{% url "serrano:datacontexts" %}',
        datacontextHistory: '{% url "serrano:datacontext-history" %}',
        dataconcepts: '{% url "serrano:dataconcepts" %}',
        datafields: '{% url "serrano:datafields" %}',
        preferences: '{% url "cilantro:preferences" %}'
    },

    // Simple way of defining default values for new DataView
    // and DataContext objects. 
    defaults: {
        dataview: {},
        datacontext: {}
    },

    routes: [{
        name: 'app',
        module: 'routes/app',
        route: false
    }, {
//      name: 'workspace',
//      module: 'routes/workspace',
//      route: 'workspace/',
//      label: 'Workspace'
    }, {
        name: 'discover',
        module: 'routes/discover',
        route: 'discover/',
        label: 'Discover'
    }, {
//      name: 'analyze',
//      module: 'routes/analyze',
//      route: 'analyze/',
//      label: 'Analyze'
    }, {
        name: 'review',
        module: 'routes/review',
        route: 'review/',
        label: 'Review',
        options: {
            perPage: 100
        }
    }]
},

// Pre-configuration, everything is relative to Cilantro's path. For
// integration of external scripts, create a contexted `require`
// function. See http://requirejs.org/docs/api.html#multiversion.
// Note that all existing scripts defined here can be used
require = {
    baseUrl: '{{ cilantro.javascript_url }}'
};
