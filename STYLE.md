# Cilantro Style Guide

Largely inspired by [Airbnb's JavaScript style guide](https://github.com/airbnb/javascript#readme)

## CoffeeScript

### Indentation & Spaces

4 spaces.. not 2, no tabs

### RequireJS `define`

Array of dependencies are line-delimited.

```coffeescript
# good
require [
    'foo'
    'bar'
    'qux'
], (foo, bar, qux) ->

# bad
require ['foo', 'bar', 'baz'], (foo, bar, baz) ->
```

### Commas

No trailing commas for line-delimited arrays or objects.

```coffeescript
# good
foo = [
    'foo'
    'bar'
    'baz'
]

bar =
  foo: 1
  bar: 2
  baz: 3

# bad
foo = [
    'foo',
    'bar',
    'baz'
]

bar =
  foo: 1,
  bar: 2,
  baz: 3
```

### Strings

Single quotes always, unless a single quote is used in the string itself

```coffeescript
# good
foo = 'hello'
bar = "can't"

# bad
foo = "bar"
bar = 'can\'t'
```

### Classes and Functions

No parenthesis with arguments that span multiple lines.

```coffeescript
# good
foo = new Foo
    bar: 1
    qux: false

foo = bar
    bar: 1
    qux: false

# bad
foo = new Foo(
    bar: 1
    qux; false
)

foo = bar(
    bar: 1
    qux: false
)
```
