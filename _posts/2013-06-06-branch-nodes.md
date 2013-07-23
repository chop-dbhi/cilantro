---
layout: page
title: "Branch Nodes"
category: ref
date: 2013-06-06 16:36:26
---

A branch node is a container for other nodes and defines the logical relationship between those nodes. As stated above, branch nodes come with a `children` collection that contains the initialized nodes contained within the branch. Nodes can be added or removed from the collection using the standard `add` and `remove` methods on the collection.

### Attributes

- `type` (required) - The logical relationship between nodes in `children`, either `and` or `or`
- `children` (required) - An array of nodes
- `concept` (required) - The ID of the concept this branch represents
- `field` - The ID of the field this branch represents

_Note, this cannot be defined without a `concept` also being defined. This is due to the Concept being the 'source of identity' for the containing fields. Fields can be associated with more than one Concept, so leaving off `concept` would result in an ambiguous association._
