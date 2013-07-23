---
layout: page
title: "Context API"
category: ref
date: 2013-06-06 16:36:26
---

See example nodes here: https://github.com/cbmi/avocado/wiki/Context-Validation#examples

There are two distinct models for interacting with a `Context` instance (as defined in Avocado). The `ContextModel` contains all the descriptive data such as `name`, `user`, `description`, the `session` flag, etc. The actual context data tree (containing conditions and branches) is located in the `json` attribute:

```coffeescript
# Get the session context for this user
cxt = c.data.contexts.getSession()
json = cxt.get('json') # { ... } or null
```

### Initialization

The `json` data as a whole is initialized as a branch node (see [[Node Types|Context-API#node-types]] below) and stored as the `root` property. Each node in the tree is converted into it's respective type. The branch nodes are special since they contain other node attributes contained in the `children` array.

When a branch node is constructed, a corresponding `children` collection is created to contain the child nodes. Having a Backbone collection enables _listening to_ and manipulating the collection rather than manually managing it (with an array).

```coffeescript
root instanceof ContextNodeModel # true, base type
root instanceof BranchNodeModel # true
root.children instanceof ContextNodeCollection # true
```

### Fetching Nodes

One of the difficulties when working with a tree structure is accessing arbitrary nodes at various depths. Each node class comes with a `fetch` method which takes `query` attributes that are used to match the node the interest. Although any set of attributes can be used, the most common is using `concept` and/or `field`. Generally the node corresponding to a concept is found first, then the node for a given field (associated with the concept) is fetched _within_ the concept node.

```coffeescript
cnode = root.fetch({concept: 4})
fnode = cnode.fetch({field: 10})
```

#### Fetch or Create

A common use case is fetching a node given some lookup object and creating a new node if no match is found. The `fetch` method described above takes an option `create` that specifies a node type. If a match is not found, a new node is created of the specified type with the `query` attributes as the initial attributes for the node.

```coffeescript
node = root.fetch({concept: 2, field: 15}, {create: 'condition'})
```

### Branches

A branch node is a container for other nodes and defines the logical relationship between those nodes. As stated above, branch nodes come with a `children` collection that contains the initialized nodes contained within the branch. Nodes can be added or removed from the collection using the standard `add` and `remove` methods on the collection.

```coffeescript
root.children.add(node)
root.children.remove(node)
```

### Public vs. Internal Attributes

Each node provides a _dual_ interface for holding internal state for the controls that manipulate them, but must provide a _public_ output when requested to be synced with the server.

```coffeescript
root.public # the public node of the context root node
root.public.children # the public children collection (since it's a branch)
```

The `public` node data is set on construction, when `save` is called on the private node (and is valid), and when the response is returned from the server upon a successful sync. The last point is important to update any server annotations that were may to the nodes.

#### Who Uses What

As a general rule, if a view only needs read-access, the public node should be used. The only state change that can occur on the public node is whether it is enabled. Calling `public.enable()` and `public.disable()` will toggle the internal state and sync with the server.

Here are the list of views that use the internal vs. public nodes:

**Internal**

- `ConceptForm` - gets or creates a branch node for the concept, calls `save` (add/update) or `clear` (remove) and then publishes a sync
- `FieldForm` - gets or creates a condition node within the concept, if not associated with a concept, the logic is the same as the `ConceptForm`
- `Control` - listens to and writes to a condition node

**Public**

- `ContextTree` - context tree rendered as a list with natural language describing the conditions

### Node Types

Below are the supported node types with the required and optional attributes listed. Note, any additional attributes can be added to the node data and will be persisted between client and server. This may be useful if the client has additional state that must be persisted across sessions.

- Condition
    - required: `operator`, `value`, `field`
    - optional: `concept`, `nulls`
- Branch
    - required: `type`, `children`, `concept`, and either `field` or `concept`
- Composite
    - _Note, there is no support yet in Cilantro for constructing composite nodes._
    - required: `composite`
