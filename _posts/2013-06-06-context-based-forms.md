---
layout: page
title: "Context Based Forms"
category: ref
date: 2013-06-06 16:36:26
---

A _context-based form_ provides an interface for interacting with context nodes. It encapsulates the necessary actions and controls for adding, updating and removing context nodes.

There are two basic types of forms:

- `FieldForm`
- `ConceptForm` - handles context node data for a given `Concept` instance.

The `FieldForm` is only aware of the `Field` instance it represents. For example, given three fields `ingredient_name`, `quantity`, and `unit` (which makes up a concept named `Ingredient`). There a `FieldForm` and `ContextNodeModel` instance associated with each one of the fields. The form's job is to manage the state of the `ContextNodeModel` as a whole (see also [Controls]({{ site.baseurl }}{% post_url 2013-06-06-controls%})).

```coffeescript
# field model instance for 'ingredient_name'
model = c.data.fields.get(1)

# fetch the context node for the current session for this field
context = c.data.contexts.getSession().fetch(field: model.id)

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
context = c.data.contexts.getSession().fetch(concept: model.id)

# initialize a new concept form representing the concept with
# context as the state.
form = new c.ui.ConceptForm
    model: model
    context: context
```

## Persisting State

As the controls are being interacted with within a form UI, the context node is updated, but not made available (by default) to it's parent node. This separation is necessary for freely using the context node as _local storage_ for state, but without worrying about partially defined conditions being synced with the server.

Once the conditions are ready to be saved, the `form.save()` method can be called to make the local state of the context node _public_ to the parent node. Since a `ConceptForm` itself contains `FieldForm`s, calling `save` will implicitly _collect_ the publicly available data from each of the fields' contexts. However, unless there is a way to save each field form independently within the concept form, there would be no way to make the field-level contexts public. The `ConceptForm` can be initialized with a `managed` flag which when `true` will perform a _deep_ save of each field.
