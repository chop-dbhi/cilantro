---
layout: page
title: "Context API"
category: ref
date: 2013-06-07 11:35:42
---

There are two distinct models for interacting with a `Context` instance (as defined in Avocado). The `ContextModel` contains all the descriptive data such as `name`, `user`, `description`, the `session` flag, etc. The actual context data tree (containing conditions and branches) is located in the `json` attribute:

```coffeescript
# Get the session context for this user
cxt = c.data.contexts.getSession()
json = cxt.get('json') # { ... } or null
```

### Node Types

Below are the supported node types with the required and optional attributes listed. Note, any additional attributes can be added to the node data and will be persisted between client and server. This may be useful if the client has additional state that must be persisted across sessions.

- [Branch Nodes]({{ site.baseurl }}{% post_url 2013-06-06-branch-nodes %})
- [Condition Nodes]({{ site.baseurl }}{% post_url 2013-06-07-condition-nodes %})
- [Composite Nodes]({{ site.baseurl }}{% post_url 2013-06-07-composite-nodes %})

### Manager

Each `ContextModel` instance comes with a `manager` property which manages state for `json` data which is the context node tree. It acts as a medium for accessing and manipulating the tree in a consistent. This prevents handing references to individual nodes which decreases the changes of memory leaks and the UI getting out of sync.
    
Two trees are maintained by the manager:

The **applied tree** contains all nodes that are applied in the current context. This is updated every time the client successfully syncs with the server. Additional metadata may be augmented provided by the server.

The **working tree** is a superset of the active tree and may contain state that has not yet been active (and thus not synced with the server). As nodes are created or existing ones are changed, they can be (re)active which causes them to be synced with the server. Upon a successful sync, these changes will propagate to the active tree and the current context will be updated.

#### Methods

All node-based methods takes an _ident object_ as the first argument. This object contains keys that are used to find/query/lookup the node in the tree. The combination of keys and values are generally assumed to be unique, however it will return the first node found regardless.

A typical query object contains a `concept` key and optionally a `field` key (since all metadata in Cilantro is concept and field driven). A new node can be defined using the `define` method:

```javascript
// define a new branch node
context.manager.define({concept: 1}, {type: 'branch'});
```

[CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete)-based methods for nodes:

- `define(query, [path], [options])` - Define/Create a new node
- `get(query, [key], [options])` - Get a node's attributes or a specific key
- `set(query, key, value, [options])` - Set a key on the node. An alternate signature can be used to set multiple attributes: `set(query, attrs, [options])`
- `clear(query, [options])` - Clears the contents of the node except for the identifiers. If this is performed on a branch node and `options.reset` is true, all child nodes will be removed.
- `apply(query, [options])` - Apply a new or update a changed node to the active tree. This will validate and _apply_ the target node to the active tree (after a successful sync).
- `remove(query, [options])` - Removes/unapplies a node from the active tree. Note, this does not remove the node from the working tree.
- `enable(query, [options])` - Enable a previously disabled node in the active tree.
- `disable(query, [options])` - Disbale a node in the active tree.

Methods for checking the state of a node:

- `isNew` - Returns true if the node exists in the working tree, but not in the active tree
- `isApplied` - Returns true if the node is marked as applied in the working tree. Note, this does not check the active tree since this method could be called while a sync is occurring which could mean the active tree has not been updated yet. To check if the node is active, use `isActive`.
- `isActive` - Returns true if the node exists in the active tree.
- `isEnabled` - Returns true if the node is in the active and is not disabled.
- `hasChanged` - Returns true if the node is new or if the contents of the node differs from the working tree and active tree

#### Events

The one side effect of proxying access through a different object is the reduced visibility of changes. The manager provides event binding for nodes using the `on`, `off`, and `trigger` methods.

```javascript
context.manager.on({concept: 1}, 'change', function(manager, query, options) {
    // ...
});
```

Handlers receive the manager instance, the query object for the node of interest as well as any data resulting from the triggered event.
