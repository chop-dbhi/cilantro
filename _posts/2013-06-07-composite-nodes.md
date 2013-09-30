---
layout: page
title: "Composite Nodes"
category: ref
date: 2013-06-07 11:35:42
---

A composite node is a pointer to an existing context. A common use case is create a branch of composite nodes which makes it trivial to perform set operations at a higher level. For example:

```javascript
var cxt = new c.data.ContextModel({
    json: {
        type: 'and',
        children: [{
            composite: 5
        }, {
            composite: 10
        }, {
            concept: 1,
            field: 5,
            operator: 'gt',
            value: 50
        }]
    }
});
```

Regardless of how complicated the JSON is on the `5` or `10` contexts, constructing a composite context like so is simple. As shown, composite nodes can be intermixed with other node types for complicated queries.

#### Data

- `composite` (required) - The context ID
