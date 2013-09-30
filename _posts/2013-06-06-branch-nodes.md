---
layout: page
title: "Branch Nodes"
category: ref
date: 2013-06-06 16:36:26
---

A branch node is a container for other nodes and defines the logical relationship between those nodes. As stated above, branch nodes come with a `children` collection that contains the initialized nodes contained within the branch. Nodes can be added or removed from the collection using the standard `add` and `remove` methods on the collection. To define and add a node in one step, use the `define` method.

#### Methods

- `define(attrs, [options])` - Mimics the `ContextManager.define` method and adds it to the branch's `children` array.

Branch nodes take an additional option `reset` for the `clear` method. This will reset the `children` collection on the branch node. This should be used with caution since views that reference the child nodes may become orphaned. A common use is for custom `ConceptForm` views which manage the views associated with child nodes in the branch.

#### State Assertions

For all state assertion methods, branch nodes take an additional option `deep` which will recursive the assertion for all children (and descedents). The `deep` option defaults to `false`.

#### Data

- `type` (required) - The logical relationship between nodes in `children`, either `and` or `or`
- `children` (required) - An array of nodes

_Note, this cannot be defined without a `concept` also being defined. This is due to the Concept being the 'source of identity' for the containing fields. Fields can be associated with more than one Concept, so leaving off `concept` would result in an ambiguous association._
