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

### Manager

Each `ContextModel` instance comes with a `manager` property which manages state for `json` data which is the context node tree. It acts as a medium for accessing and manipulating nodes in the tree in a standard way to ensure integrity in the tree.
    
Two trees are maintained by the manager:

The **upstream tree** represents the tree that last synced with the server which represents the currently active/applied context. This is strictly used for comparison against the working tree.

The **working tree** is a superset of the applied tree and may contain state that has not yet been active (and thus not synced with the server). As nodes are created or existing ones are changed, they can be (re)active which causes them to be synced with the server. Upon a successful sync, these changes will propagate to the active tree and the current context will be updated.

#### Methods

All node-based methods takes an _identity object_ as the first argument. This object contains keys that are used to find the node in the tree. The combination of keys and values are generally assumed to be unique, however it will return the first node found regardless.

A typical ident object contains a `concept` key and optionally a `field` key (since all metadata in Cilantro is concept and field driven). A new node can be defined using the `define` method:

```javascript
// define a new branch node
context.manager.define({concept: 1}, {type: 'branch'});
```

[CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete)-based methods for nodes:

- `define(attrs, [path], [options])` - Create and insert a new node in the working tree. The default identity of all nodes are `concept` and `field` (if available). An alternate identity can be define by defining the `identKeys` option which is an array of keys on the object that represent the node's identity. If a node exists with the same identity, nothing will happen. If `path` is supplied, the node will be explicitly defined in the node defined by the path. Remember, nodes can only be defined within branch nodes.
- `find(ident, [options])` - Find and return the node with specified identity.
- `remove(ident, [options])` - Marks all nodes in working tree for removal from the upstream tree. Note however that this does not actually remove the nodes from the working tree (so it does destroy the local state).

- `get(ident, [key], [options])` - Get a node's attributes or a specific key
- `set(ident, key, value, [options])` - Set a key on the node. An alternate signature can be used to set multiple attributes: `set(ident, attrs, [options])`
- `clear(ident, [options])` - Clears the contents of the node except for the identifiers. If this is performed on a branch node and `options.reset` is true, all child nodes will be removed.
- `apply(ident, [options])` - Apply a new or update a changed node to the active tree. This will validate and _apply_ the target node to the active tree (after a successful sync).
- `enable(ident, [options])` - Enable a previously disabled node in the active tree.
- `disable(ident, [options])` - Disbale a node in the active tree.

### Nodes

Below are the supported node types with the required and optional attributes listed. Note, any additional attributes can be added to the node data and will be persisted between client and server. This may be useful if the client has additional state that must be persisted across sessions.

- [Branch Nodes]({{ site.baseurl }}{% post_url 2013-06-06-branch-nodes %})
- [Condition Nodes]({{ site.baseurl }}{% post_url 2013-06-07-condition-nodes %})
- [Composite Nodes]({{ site.baseurl }}{% post_url 2013-06-07-composite-nodes %})

#### States

- `new/existing` - The node is new if it does not exist in the upstream tree.
- `valid/invalid` - The node is valid if the node validates for it's specific type.
- `enabled/disabled` - The node is enabled if the `enabled` is not false. This determines if the node is actually applied/enforced in context.
- `clean/dirty` - The node is dirty if it is new or if it differs from upstream.
- `added/removed` - The node is removed when it _did_ exist upstream, but is now removed.

#### Events

- `before:apply` - Triggered before the node is applied.
- `apply` - Triggered when the node has been marked for being applied and synced to the upstream. If the node fails to validation, this event will not fire.
- `before:remove` - Triggered before the node is removed.
- `remove` - Triggered when the node has been marked for removal.
- `before:revert` - Triggered before the node is reverted.
- `revert` - Triggered when the node has been reverted.

#### Properties

- `identKeys` - An array of key names that represent the identifiers of the node.
- `manager` _(optional)_ - If defined, this node is considered _managed_ and can be compared against the _other_ tree (see above).

#### Methods

- `identity()` - Returns the identity of the node. Note, this different from `node.id`.
- `find(ident, [options])` - Find a node within this node.
- `clear([options])` - Clear the node's attributes except for the identity attributes.
- `revert([options])` - Reverts the node's attributes to the upstream state if one exists.

##### State Assertions

- `isNew([options])` - Returns true if the node does not exist in the upstream tree.
- `isValid([options])` - Returns true if the node is in a valid state for the type.
- `isEnabled([options])` - Returns true if the node is enabled.
- `isDirty([options])` - Returns true if the node is new or if the nodes differs in the working and upstream tree.
- `isRemoved([options])` - Returns true if the node is marked as removed.

##### State Changes

- `enable([options])` - Mark the node as enabled.
- `disable([options])` - Mark the node as disabled.
- `apply([options])` - Validate and mark the node as applied.
- `remove([options])` - Mark the node for removal.

##### Toggles

- `toggleEnabled([options])` - Toggle the enabled state
