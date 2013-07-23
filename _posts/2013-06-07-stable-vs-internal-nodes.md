---
layout: page
title: "Stable vs. Internal Nodes"
category: ref
date: 2013-06-07 11:35:42
---

The `ContextModel` has two node instances, `stable` and `internal`, representing the raw `json` data that exists on the model. Both node instances have the same API so views written with one is interoperable with the other as well.

The `stable` node represents the state since the context was last synced with the server, e.g. it's last known stable state. The only actions that can be performed directly to the node (or it's descendants) is disabling/enabling it or removing it entirely. The reason for this is it does not require any re-validation of the contents of the nodes, such as with conditions.

The `internal` node represents the state of the context as the user sees it including all changes, additions and deletions that have not yet been synced with the server. Each internal node has a copy of it's last stable state for reference which comes from the server directly (initial sync) or when _committed_ locally in preparation for syncing with the server. The `stableAttributes` is what is returned by the internal when being synced with the server. If the node has not been committed, the `isDirty()` method will return `true` which compare the `attributes` against the `stableAttributes`.

#### Who Uses What

As a general rule, if a view only needs read-access, the stable node should be used. As stated above, the only changes that can be directly made to the stable node is enabling/disabling it and removing it.

Here are the list of views that use the stable vs. internal nodes:

**Stable**

- `ContextTree` - Context tree rendered as a flat list with natural language describing the conditions

**Internal**

- `ConceptForm` - Gets or creates a branch node for the concept, calls `save` (add/update) or `clear` (remove) and then publishes a sync
- `FieldForm` - Gets or creates a condition node within the concept, if not associated with a concept, the logic is the same as the `ConceptForm`
- `Control` - Listens to and writes to a condition node
