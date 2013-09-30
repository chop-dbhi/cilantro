---
layout: page
title: "Base Models"
category: api
date: 2013-06-06 16:36:26
---

Serrano implements the [HAL](https://github.com/cbmi/serrano/wiki/HAL) conventions for providing a consistent interface to referencing and accessing related resources. As a result, a base `Model` and `Collection` class have been defined to parse and wrap the `_links` objects. These classes are available at `c.models.Model` and `c.models.Collection`, respectively.

The `_links` object simplified to a local `links` objects that can be accessed directly (rather than calling `model.get('_links').foo.href`. Furthermore, the link with the `self` relation will be used for the `url` method.

```coffeescript
model = new c.models.Model
    _links:
        self:
            href: 'http://example.com'
        next:
            href: 'http://example.com/?page=2'

model.url() # 'http://example.com/'
model.links.next # 'http://example.com/?page=2'
```
