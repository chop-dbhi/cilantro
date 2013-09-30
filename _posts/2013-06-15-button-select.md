---
layout: page
title: "Button Select"
category: api
date: 2013-06-15 00:03:15
---

Cilantro has a custom dropdown view that utilizes the Backbone button group. The intent of this is to replace the standard `<select>` element (for most things). It provides a more consistent look and feel as well as enables more customization with the dropdown options such as embedded elements.

When an option is selected, it fires a `change` both on the DOM element and the view. This is intended to mimic the `change` fired by `<select>` elements so parent elements receive the bubbled event.

### `c.ui.ButtonSelect`

#### Options

- `size` - The button size, i.e. `large`, `small`, `mini`. Default is nothing which uses the standard size.
- `collection` - Defines the set of choices/options to be presented in the dropdown. This can be one of three things.
    - A Backbone collection with each model having a `value` attribute defined
    - An array of values that will be converted into a collection for use by the button
    - An array of objects each having a `value` attribute
- `placeholder` - The text to render when no choice been selected. Default is `----`

The `value` attribute is the only required attribute and will always be emitted on events. However, if the `label` attribute is defined this will be used for display in the dropdown itself.

If a model has a `selected` attribute and it is `true`, this will be the default selected value.

```javascript
var btn = new c.ui.ButtonSelect({
    size: 'large',
    collection: ['One', 'Two', 'Three']
});
```
