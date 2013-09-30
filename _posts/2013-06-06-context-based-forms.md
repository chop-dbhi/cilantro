---
layout: page
title: "Context Based Forms"
category: ref
date: 2013-06-06 16:36:26
---

A _context-based form_ provides an interface for context nodes.

There are two basic types of forms:

- `FieldForm` - handles context node data for a `Field` instance
- `ConceptForm` - handles context node data for a `Concept` instance

The `FieldForm` is only aware of the `Field` instance it represents. For example, given three fields `ingredient_name`, `quantity`, and `unit` (which makes up a concept named `Ingredient`). There a `FieldForm` and `ContextNodeModel` instance associated with each one of the fields. The form's job is to manage the state of the `ContextNodeModel` as a whole (see also [Controls]({{ site.baseurl }}{% post_url 2013-06-06-controls %})).

```coffeescript
# field model instance for 'ingredient_name'
model = c.data.fields.get(1)

# fetch the context node for the current session for this field
context = c.data.contexts.session.find(field: model.id)

# initialize a new field form representing the field with
# context as the state.
form = new c.ui.FieldForm
    model: model
    context: context
```

The `ConceptForm` provides the same API as `FieldForm` and manages it's own `ContextNodeModel` that acts as a container for it's associated fields. For example, there would be a single `ConceptForm` associated with the concept "Ingredient", but it would also handle creating separate `FieldForm` (and `ContextNodeModel` instances) for each of it's fields.

```coffeescript
# field model instance for 'ingredient'
model = c.data.concepts.get(1)

# fetch the context node for the current session for this concept
context = c.data.contexts.session.find(concept: model.id)

# initialize a new concept form representing the concept with
# context as the state.
form = new c.ui.ConceptForm
    model: model
    context: context
```

## Persisting State

As the controls are being interacted with within a form UI, the context node is updated, but not made available (by default) to it's parent node. This separation is necessary for freely using the context node as _local storage_ for state, but without worrying about partially defined conditions being synced with the server.