# Cilantro

#### _Client for the Serrano and Avocado stack_

## Background

Cilantro is a modular Web browser-based client for [Serrano](http://cbmi.github.com/serrano/), a hypermedia API implementation of [Avocado](http://cbmi.github.com/avocado/). Collectively these three libraries make up the [Harvest Stack](http://harvest.research.chop.edu).

Cilantro provides various modules and utilies which act as sane defaults for interfacing with the Serrano API. "Out of the box", Cilantro provides a default interface which is suitable for most use cases or it may be used strictly as a standalone client-side library in which specific modules are used to create a custom interface.

Since this is a client for supporting data discovery applications, the UI must be flexible in order to support different workflows that are employed by the kind of data the application is representing.

## Compatibility

Cilantro relies on a Serrano-compatible API with version 2.0.15+

## Install

## Contribute

### Anyone!

Review [the current issues](https://github.com/cbmi/cilantro/issues) and provide feedback for feature requests or if you think you have found a bug or would like to get feedback on a new feature, [open a ticket](https://github.com/cbmi/cilantro/issues/new).

Fork the repository, clone it locally and create a branch for the issue/feature you are developing.

## Developers

For script development, [CoffeeScript](http://coffeescript.org) is used to ensure consistently generated JavaScript.

All scripts are written as modules using the [AMD API](http://requirejs.org/docs/whyamd.html). For distribution, all scripts are _uglified_ and some are concatenated using the [RequireJS optimizer](http://requirejs.org/docs/optimization.html).

If doing [Sass](http://sass-lang.com) development for the default client, the following are required to compile the SCSS files:

- [Ruby](http://www.ruby-lang.org)
- [RubyGems](http://rubygems.org)
- Sass - `gem install sass`

If doing CoffeeScript development, the following dependencies are required to compile CoffeeScript files and run the optimizer:

- [Node](http://nodejs.org)
- [npm](https://npmjs.org)
- CoffeeScript - `npm install -g coffee-script`
- UglifyJS - `npm install -g uglify-js`

### Makefile

Yes, makefiles are still cool.. here are few targets to get you going

- `watch` - Starts a Node and Ruby process in the background to watch CoffeeScript and Sass/SCSS files
- `unwatch` - Kills the Node and Ruby processes
- `sass` - One-time SCSS compilation
- `coffee` - One-time CoffeeScript compilation
- `optimize`- Optimize JavaScript
- `build` - Combines `sass`, `coffee`, and `optimize` for a pre-distribution build
- `client` - Performs build and optimize setup and collects all static assets into the client directory
- `all` - Performs a `build` followed by `watch` for continuing local development
