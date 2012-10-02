# Cilantro
#### _Client for the Serrano and Avocado stack_

## Background

Cilantro is a modular Web browser-based client for the [Serrano](http://cbmi.github.com/serrano/) hypermedia API implementation of [Avocado](http://cbmi.github.com/avocado/).

Cilantro provides various modules and utilies which act as sane defaults for interfacing with the Serrano API. "Out of the box", Cilantro provides a default interface which is suitable for most use cases or it may be used strictly as a standalone client-side library in which specific modules are used to create a custom interface.

Since this is a client for supporting data discovery applications, the UI must be flexible in order to support different workflows that are employed by the kind of data the application is representing.

## Install

This will install a variety of dependencies including Serrano and Avocado.

```bash
$ pip install cilantro
```

## Configure

Include `cilantro.urls` in your `ROOT_URLCONF` (the main **urls.py**):

```python
urlpatterns = patterns('',
    ...
    url(r'', include('cilantro.urls')),
)
```

Add the Cilantro context processor:

```python
# The easiest way is to import and augment the default one...
from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS

TEMPLATE_CONTEXT_PROCESSORS += (
    'django.core.context_processors.request',
    'cilantro.context_processors.cilantro',
)
```

Migrate the Cilantro tables:

```bash
$ manage.py migrate cilantro
```

## Customize

### Templates

Cilantro uses [Django's templates](https://docs.djangoproject.com/en/1.4/topics/templates/) for rendering the base template which ultimately bootstraps the JavaScript code.

There are four templates cilantro defines. For easy overriding, the template inheritance tree looks like this:

```bash
cilantro/_base.html
   |
   -- cilantro/base.html
       |
       -- cilantro/_index.html
           |
           __ cilantro/index.html
```

#### Template Blocks

- `head_title` - Wraps the contents of the HTML `<title>` tag. Contains the Cilantro [site configuration] title by default.
- `styles` - Defined in the `<head>` block, this contains all stylesheet links `<link rel=stylesheet href=style.css>` and `<style>` blocks
- `scripts` - Contains all the `<script>` tags that will ultimately bootstrap the application.

- `header` - The header which typically contains the site brand, primary navigation and account access. If this block is overridden, the entire navigation bar will be replaced. See `header_content` and `header_links` for finer grain blocks.
- `header_content` - The entire contents of the header. By default this contains brand, navigation, and account links.
- `header_links` - The header navigation links. Of all the `header*` blocks, this is typically the only one that should be extended.
- `subnav` - The secondary navigation bar (under the header) for other links and/or application controls. See `subnav_content` for simply populating the contents.
- `subnav_content` - The contents of the secondary navigation bar.
- `content` - The content of the page. This should usually always contain something, as it lays the foundation for the modules to work with.
- `extra_content` - A block to add additional non-inline elements that are absolute positioned or fixed within the document, e.g. markup for modal dialogs.

For any of these blocks, they can be extended rather than completely overridden by adding `{{ block.super }}` within the block before adding additional content to the block.

Obviously for complete control, `cilantro/index.html` could not extend `cilantro/base.html` at all and contain all new markup.

## JavaScript API

Modules are broken up in various groups depending on the functionality including the third-party libraries, `core` features, `plugins`, `views`, and `models`.

### Core Features

### Models/Collections

### Views

### Plugins

### Pub/Sub Topics

Cilantro's JavaScript API uses a [publish-subscribe pattern](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) internally for communicating between modules. These communication _topics_ can be subscribed to by any module which means integrating additional functionality to the application is relatively easy.

To use simply include the `mediator` module in a script:

```javascript
define(['mediator'], function(mediator) {
    // An example topic, the 'datacontext/change' topic is published
    // any time the session datacontext object has been synced with
    // the server after being saved
    mediator.subscribe('datacontext/change', function() {
        // ... do something
    });
});
```


## Contribute

### Anyone!

Review [the current issues](https://github.com/cbmi/cilantro/issues) and provide feedback for feature requests or if you think you have found a bug or would like to get feedback on a new feature, [open a ticket](https://github.com/cbmi/cilantro/issues/new).

### If you have skillz..

Fork the repository, clone it locally and create a branch for the issue/feature you are developing.

## Developers

For stylesheet development, the [Sass](http://sass-lang.com) CSS preprocessor is used, specifically using the SCSS syntax.

For script development, [CoffeeScript](http://coffeescript.org) is used to ensure consistently generated JavaScript.

All scripts are written as modules using the [AMD API](http://requirejs.org/docs/whyamd.html). For distribution, all scripts are _uglified_ and some are concatenated using the [RequireJS optimizer](http://requirejs.org/docs/optimization.html).

If doing SCSS development, the following are required to compile the SCSS files:

- [Ruby](http://www.ruby-lang.org)
- [RubyGems](http://rubygems.org)
- Sass - `gem install sass`

If doing CoffeeScript development, the following dependencies are required to compile CoffeeScript files and run the optimizer:

- [Node](http://nodejs.org)
- [npm](https://npmjs.org)
- CoffeeScript - `npm install -g coffee-script`
- UglifyJS - `npm install -g uglify-js`

**Note, all compiled CSS and JavaScript files must be added to the repo's .gitignore file to prevent having to deal with merging these files over time.**

### Makefile FTW

Yes, makefiles are still cool.. here are few targets to get you going

- `watch` - Starts a Node and Ruby process in the background to watch CoffeeScript and Sass/SCSS files
- `unwatch` - Kills the Node and Ruby processes
- `sass` - One-time SCSS compilation
- `coffee` - One-time CoffeeScript compilation
- `optimize`- Optimize JavaScript
- `build` - Combines `sass`, `coffee`, and `optimize` for a pre-distribution build
- `all` - Performs a `build` followed by `watch` for continuing local development
