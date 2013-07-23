---
layout: page
title: "Condition Nodes"
category: ref
date: 2013-06-07 11:35:42
---

Condition nodes are directly manipulated by [control-based view](). 

### Attributes

#### Required
- `operator` (required) - A string specifying the condition operator
- `value` (required) - A primitive or array of primitives representing the value of the condition
- `field` (required) - The field the condition applies to
- `concept` (required) - The concept the field is associated with
- `nulls` - A boolean denoting whether to include NULL values and/or empty strings in the result set
