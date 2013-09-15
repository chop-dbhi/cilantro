# Contributing

First off, thank you for considering a contribution!

- If you do not have write access to the repo (i.e. not a core contributor), create a fork of Cilantro
- Branches are used to isolate development and ensure clear and concise intent of the code. Always do your work in a branch off the `develop` branch. This will be a mirror of the work-in-progres (WIP) branch for the current major version, e.g. `2.x`. Name the branch after the issue and number, e.g. `issue-123`. If there is no issue number, [please create one first](https://github.com/cbmi/cilantro/issues/) before starting your work.
- If working on existing files, ensure the coding style is kept consistent
with the code around it. If creating new files or you are unsure of a pattern
or preference please consult the [style
guides](https://github.com/cbmi/style-guides/).

## Modules

The Cilantro codebase is broken up into individual modules using the [Asynchronouse Module Definition (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD). [RequireJS](http://requirejs.org/) is for it's rich feature set, it's die-hard [author](http://jrburke.com/), and it's powerful optimizer [r.js](https://github.com/jrburke/r.js).

### Module _Aggregator_

Cilantro has the convention of keeping modules relatively small and putting them under their directory. For example, if a module named `views.coffee` grew too large in size, we follow the pattern:

- Create a directory named after the module, i.e. `views`
- Break up module's contents into separate modules under the directory
- Replace the contents of the module using the following template

```coffeescript
define [
    'underscore'
    './views/mod1'
    './views/mod2'
    # etc.
], (_, mods...) ->

    _.extend {}, mods...
```

Whatever each module exports, it will be _aggregated_ into a single object which is representative of the original module's content. This is a transparent change for other modules that depend on the `views` module, but ensures maintainability when a module gets too large.

### Module Overrides

The core modules of Cilantro are referenced using relative paths to ensure integrity of the codebase when used with other libraries. However there are few areas where Cilantro uses _named_ modules which enables overriding or supplying your own version of the dependency.

The current set of modules that can be overridden include the major third-party libraries. The reasoning is that since they so common, it may be desirable or necessary to use a specific version rather than the one bundled with Cilantro. The list includes by module name:

- jquery
- backbone
- underscore
- marionette
- highcharts
- bootstrap
