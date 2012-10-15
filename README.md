# Cilantro
#### _Client for the Serrano and Avocado stack_

## Background

Cilantro is a modular Web browser-based client for [Serrano](http://cbmi.github.com/serrano/), a hypermedia API implementation of [Avocado](http://cbmi.github.com/avocado/). Collectively these three libraries make up the [Harvest Stack](http://harvest.research.chop.edu).

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

Migrate the Cilantro models:

```bash
$ manage.py migrate cilantro
```

## Site Configuration

Login to the Admin and create a new Site Configuration. This is a simple way to customize various _branding_ parts of the site without having override the templates (below). These include:

- `title` - The title of the site that will be appear in the upper left corner of the site
- `subtitle` - The _subtitle_ or tagline which will appear to the right of the title
- `status_label` - An optional label that will appear next to the title used to mark the site as "beta", "alpha", "dev", etc.
- `site` - Optionally associate this configuration with a site. Multiple configurations can be created for different domains, but if no site is specified, this will be used across all sites.
- `footer_content` - Footer content that will appear across pages. This area is Markdown-enabled
- `google_analytics` - Specify a Google Analytics tracking ID
- `auth_required` - Flag a site to require users to be authenticated when using the site.


## Customize

### Templates

Cilantro uses [Django's templates](https://docs.djangoproject.com/en/1.4/topics/templates/) for rendering the base template which ultimately bootstraps the JavaScript code.

There are four structural templates cilantro defines. For easy overriding, the template inheritance tree looks like this:

```
cilantro/_base.html
   |
   -- cilantro/base.html
       |
       -- cilantro/_index.html
           |
           __ cilantro/index.html
```

The `_base.html` template includes the below templates as well to be easily customized. The templates that are included by `_header.html` also shown.

```
cilantro/_header.html
cilantro/_subnav.html
cilantro/_content.html
cilantro/_footer.html
```

The `_header.html` template has it's own set of files that are included and can be overridden.

```
cilantro/_brand.html
cilantro/_nav.html
cilantro/_nav-auth.html
```

_Note: the `_nav.html` template will be included only if authentication is required for the site. This will display a login link. If the user is authenticated, the `_nav-auth.html` template will be used instead._

#### Template Blocks

**`_base.html`**

- `head_title` - Wraps the contents of the HTML `<title>` tag. Contains the Cilantro [site configuration] title by default.
- `styles` - Defined in the `<head>` block, this contains all stylesheet links `<link rel=stylesheet href=style.css>` and `<style>` blocks
- `header` - The header which typically contains the site brand, primary navigation and account access. If this block is overridden, the entire navigation bar will be replaced. See `header_content` and `header_links` for finer grain blocks.
- `subnav` - The secondary navigation bar (under the header) for other links and/or application controls. See `subnav_content` for simply populating the contents.
- `content` - The content of the page. This should usually always contain something, as it lays the foundation for the modules to work with.
- `extra_content` - Area for adding any additional markup such as absolute or fixed position elements, e.g. modals.
- `footer` - Includes the Markdown rendered `footer_content` defined on the `SiteConfiguration` model
- `extra_content` - A block to add additional non-inline elements that are absolute positioned or fixed within the document, e.g. markup for modal dialogs.
- `jsconfig` - Contains non-script variables such as the `CSRF_TOKEN` and the RequireJS config. Unless you know what
you're doing, do not override this block. If you need to extend it use Django's `{{ block.super }}` syntax.
- `scripts` - Contains all the `<script>` tags that will ultimately bootstrap the application.

**`_header.html`**

- `header_content` - The entire contents of the header. By default this contains brand, navigation, and account links.
- `header_links` - The header navigation links. Of all the `header*` blocks, this is typically the only one that should be extended.

**`_subnav.html`**

- `subnav_content` - The contents of the secondary navigation bar.

For any of these blocks, they can be extended rather than completely overridden by adding `{{ block.super }}` within the block before adding additional content to the block.

Obviously for complete control, `cilantro/index.html` could not extend `cilantro/base.html` at all and contain all new markup.

## JavaScript API

Cilantro makes use of the [AMD API](http://requirejs.org/docs/whyamd.html) for defining script _modules_. Modules are broken up in various groups depending on the functionality including third-party libraries, _core_ modules, library plugins, and finally Cilantro-specific modules.

### Configuration

Cilantro is designed to be modular and extensible via JavaScript. There are a few configuration options that can be set before all the JavaScript loads to customize the which components get loaded.

A few of them are defined ahead such as the Serrano endpoints Cilantro will use to interact with the data. Unless you decide to not use Serrano or you need to override a particular endpoint, you should not changes the `urls` object.

```javascript
var cilantro = {
    urls: {
        datafields: '/api/fields/',
        dataconcepts: '/api/concepts/',
        datacontexts: '/api/contexts/',
        datacontextHistory: '/api/contexts/history/',
        dataviews: '/api/views/',
        dataviewHistory: '/api/views/history/',
        preferences: '/api/preferences/'
    },
    routes: [{
        name: 'app',
        module: 'routes/app',
    }, {
        name: 'discover',
        module: 'routes/discover',
        url: '/discover/',
        label: 'Discover'
    }, {
        name: 'review',
        module: 'routes/review',
        url: '/review/',
        label: 'Review'
    }]
};
```


### Modules

#### Third-Party Libraries

- jQuery
- Backbone
- Underscore
- Bootstrap
- Highcharts

#### Core

- environ
- meditator

#### Models/Collections

The four modules that define the core data structures are mimicked after the models defined in Avocado.

**serrano/datacontext**

- `DataContextNode` - Represents a single condition or condition branch that exists in a `DataContext` tree
- `DataContext` - Represents a single `DataContext` object consisting of zero or more `DataContextNode`s
- `DataContexts` - The active list of `DataContext`s
- `DataContextHistory` - An archived list of `DataContext`s that represents all previous _versions_ of all `DataContext`s

**serrano/dataview**


- `DataView` - Represents a single `DataView` which stores the selected columns and sorting options in the output view
- `DataViews` - The active list of `DataView`s
- `DataViewHistory` - An archived list of `DataView`s that represents all previous _versions_ of all `DataView`s

**serrano/datafield**

- `DataField` - A single `DataField` object which contains the metadata and links used to drive the interface
- `DataFields` - The list of all published `DataField`s

**serrano/dataconcept**

- `DataConcept` - A single `DataConcept` object which contains the metadata and links used to drive the interface
- `DataConcepts` - The list of all published `DataConcept`s


### Module Communication

Cilantro's JavaScript API uses a [publish/subscribe pattern](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) for communicating between modules. These communication _channels_ can be subscribed to by any module which means integrating additional functionality to the application is relatively simple.

To use, include the `mediator` module in a script:

```javascript
define(['mediator'], function(mediator) {
    mediator.subscribe('some/channel', function() {
        // ... do something
    });
});
```

#### Common Channels

There are two groups of channels Cilantro utilizes for inter-module communication. A common set of channels _suffixes_ for model-based types have been established.

The publishers of these channels must, at a minimum, pass _itself_ as the first argument for subscribers to consume. The publishers of channels subscribed by these objects must provide the `id` of the model it intends to communicate with.

- `TYPE/changed` - This signifies the object has been updated on the client, but not synced with the server. Subscribers who do not depend on any properties about the object that requires server-side processing can utilize this channel to make immediate updates, such as re-rendering a UI component.

- `TYPE/syncing` - This channel is published while the object is being synced with the server. Subscribers can make use of this channel to representation a _loading_ or _syncing_ state with the server.

- `TYPE/synced` - This channel is published when the object is done syncing with the server, whether it was successful or there was an error. An additional argument is provided which is the status of the sync, either `success` or `error`. Subscribers can make use of this to remove the loading status from `FOO/syncing`, but can also do something with respect to the `status`.

- `TYPE/pause` - This channel is subscribed to by the objects themselves. By default, objects will sync transparently as they are modified, but in certain cases where a lot of changes are occurring (generally at an unknown frequency), syncing should be deferred to prevent too much `chatty` communication with the server. Publishing to this channel will pause syncing until `TYPE/resume` is published to (see belo).

- `TYPE/resume` - This channel is subscribed to by the objects themselves. This is used to resume syncing with the server when it has been paused (see above). If any changes have been made to the object, a resume will cause the object to sync with the server.


_A design note aside: channel names are not specific to particular instances of the object which has the advantage of being more flexible from the subscriber perspective to act on the specific instance that publish to the channel or generally for that object type. The disadvantage is the lack of transparency of which objects/modules are actively communicating. It also prevents the mediator from applying permissions at the instance level. At this time, the disadvantages have not been a problem, but may change in a future release._

#### Type-Specific Channels

In addition to the generic channels above, `DataContext` and `DataView` objects have their own specific channels for interacting with them.

**DataContext**

All channels published and subscribed by `DataContext` objects are prefixed with `datacontext`.

- `datacontext/add` - Subscribed to by `DataContext` objects. Publishers must pass in a `DataContextNode` instance to be added to this `DataContext`. If the same node is added more than twice, it will simply be ignored. At this point, the `DataContext` will observe changes on the node and will sync transparently anytime changes are made.

- `datacontext/remove` - Subscribed to by `DataContext` objects. Publishers must pass in a `DataContextNode` instance to be removed from the `DataContext` tree.

**DataView**

All channels published and subscribed by `DataView` objects are prefixed with `dataview`.

- `dataview/columns` - Subscribed to by `DataView` objects. Publishers must pass in an array of `DataConcept` IDs that represent the ordered chosen columns for output.
- `dataview/ordering` - Subscribed to by `DataView` objects. Publishers must pass in an array of `DataConcept` IDs and their selected ordering such as `[[1, 'desc'], [3, 'asc']]`.


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
