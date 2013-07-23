---
layout: page
title: "Template CSS"
category: ref
date: 2013-06-06 16:36:26
---

## SCSS Mixins

Cilantro uses [Bourbon](http://bourbon.io/docs/) for providing a set of mixins that enable using a uniform syntax for vendor-prefixed CSS rules. Cilantro provides a few as well for common styles:

- `backdrop` - slight raised look
- `nobackdrop` - removes the backdrop

## View Types

### _Empty_ Views

These views represent the default or empty state of a data-driven view. Marionette has a formal notion of this type of view via the [`emptyView` option](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.collectionview.md#collectionviews-emptyview) for collections. When the collection is empty, the _empty_ view is displayed.

Cilantro comes with an `EmptyView` class that automatically adds the `empty-view` class (in addition to any other classes in `className`).
