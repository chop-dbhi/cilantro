---
layout: page
title: "Configuration"
category: ref
date: 2013-06-06 16:36:26
---

Cilantro supports a set of configuration options that can be defined prior loading Cilantro on the page.

## Options

### url

The default API endpoint that will be used when `openSession` is called.

### credentials

The default set of credentials to use when `openSession` is called.

### autoload

If true a session denoted by `url` will be immediately opened.

### autoroute

If true all links on the page will be caught and attempted to be navigated to for Cilantro. [Read more about routes]({{ site.baseurl }}{% post_url 2013-06-06-routes%})

### routes

An array of the default routes that are registered on load. [Read more about routes]({{ site.baseurl }}{% post_url 2013-06-06-routes%})

### ui.main

A selector that represents the target element views will be rendered in.

## Methods

Two methods exists on `cilantro` for getting/setting configuration options post-load.

## getOption

Supports dot-delimited syntax on the keys:

```javascript
cilantro.getOption('foo.bar.baz');
```

## setOption

Supports dot-delimited syntax on the keys:

```javascript
// This is valid..
cilantro.config = {
    foo: {
        bar: {
            baz: {}
        }
    }
};
cilantro.setOption('foo.bar.baz', 1);

// And this..
cilantro.config = {
    foo: [{
        bar: {
            baz: {}
        }
    }]
};
cilantro.setOption('foo.0.bar.baz', 1);
```
