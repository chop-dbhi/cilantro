# Query components

The purpose of this document is to describe query components that are currently implemented, the supported (or intended) user interactions, and the requirements to support these interactions. The following questions are asked for each component.

- What is needed to render the component?
- What is needed to render an existing state?
- What interactions should the component support, if any?
- What components are needed to support each interaction?
- What operations are required to support this interaction?
- What configuration does the component support, if any?
- What is the final output the component must produce for the query?

Some simple notiation is used to express operations. The basic form is `(X) -> Y`. `[x]` means list/set of `x` values. `(x, ...)` is a tuple of values. `x'` is the new value of `x`.

## Number/date input

What is needed to render the component?

- Min and max values of distribution
  - Used for input placeholders to inform the boundaries

What is needed to render an existing state?

- Lower and upper value
- Negated flag
  - Toggles between, not between

What interactions should the component support, if any?

- Ability to enter a lower and upper bound
- Ability to negate/invert the range

What components are needed to support each interaction?

- Two input boxes for bounds
- Toggle for negated flag

What operations are required to support this interaction?

- Set lower or upper bound
  - `((lower, upper), lower') -> (lower', upper)`
  - `((lower, upper), upper') -> (lower, upper')`
- Flip the operator
  - `((lower, upper)) -> ~(lower, upper)`

What configuration does the component support, if any?

- None

What is the final output the component must produce for the query?

- The range `(lower, upper)`
- Negated flag

## Searchable list

What is needed to render the component?

- Set of values a user can select.

What is needed to render an existing state?

- Set of `[value]` the user previously selected.
- Negation flag

What interactions should the component support, if any?

- Ability to filter the values by keyword
- Ability to add and remove a value from the user's set
- Ability to negate the selected values
- Supply set of free-text values

What components are needed to support each interaction?

- Input box for keyword search
- Buttons to add/remove 
- Multi-line input (textarea)

What operations are required to support this interaction?

- Get initial set of values
  - `() -> [value]`
- Search for values
  - `(query) -> [value]`
- Add a value to the user's set
  - `([value], value) -> [value]`
- Remove a value from a user's set
  - `([value], value) -> [value]`
- Flip the operator of the user's set
  - `([value]) -> ~[value]`
- Validate a user-supplied value
  - `(value) -> bool`

What configuration does the component support, if any?

- None

What is the final output the component must produce for the query?

- Set of `[value]` the user selected
- Negation flag

## Enumerated list

What is needed to render the component?

- Set of values a user can select.
- Relative count of each value with respect to the root model
  - For display and to compute the bar length

What is needed to render an existing state?

- Set of `[value]` the user previously selected
- Negation flag

What interactions should the component support, if any?

- Ability to filter the values by substring for long lists (currently >=30)
- Ability to select/deselect a value
- Ability to negate the selected values

What components are needed to support each interaction?

- Input box for keyword search
- Buttons to select/deselect

What operations are required to support this interaction?

- Get initial set of values
  - `() -> [value]`
- Search for values
  - `(query) -> [value]`
- Add a value to the user's set
  - `([value], value) -> [value]`
- Remove a value from a user's set
  - `([value], value) -> [value]`
- Flip the operator of the user's set
  - `([value]) -> ~[value]`

What configuration does the component support, if any?

- None

What is the final output the component must produce for the query?

- Set of `[value]` the user selected
- Negation flag

## Vocab browser

What is needed to render the component?

- Set of values a user can select.

What is needed to render an existing state?

- Set of `[(value, operator)]` the user previously selected.

What interactions should the component support, if any?

- Ability to filter the values by keyword
- Ability to navigate hierarchical vocabularies
- Ability to add and remove a value from the user's set
- Ability to set the operator for each added value

What components are needed to support each interaction?

- Input box for keyword search
- Buttons to navigate up and down the hierarchy
- Buttons to add/remove values from the user's set
- Separate visible lists for each operator

What operations are required to support this interaction?

- Get initial set of values
  - `() -> [value]`
- Search for values
  - `(query) -> [value]`
- Get travesal path options
  - `(value) -> [path]`
- Get the set of values for a value-path traversal
  - `(value, path) -> [value]`
- Add a value to the user's set
  - `([(value, operator)], value) -> [(value, operator)]`
- Remove a value from a user's set
  - `([(value, operator)], value) -> [(value, operator)]`
  - (The same value cannot be selected multiple times)
- Set the operator a value
  - `([(value, operator)], value, operator) -> [(value, operator)]`

What configuration does the component support, if any?

- None

What is the final output the component must produce for the query?

- Set of `[(value, operator)]` the user selected

## Free-text search

What is needed to render the component?

- Nothing

What is needed to render an existing state?

- Existing search term

What interactions should the component support, if any?

- Enter a search term
- Preview matched documents

What components are needed to support each interaction?

- Input for search term
- Preview area for matched documents

What operations are required to support this interaction?

- Fetch matched documents for preview
  - `(query) -> [document]`

What configuration does the component support, if any?

- None

What is the final output the component must produce for the query?

- Search term
