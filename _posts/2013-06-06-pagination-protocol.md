---
layout: page
title: "Pagination Protocol"
category: ref
date: 2013-06-06 16:36:26
---

The paginator protocol defines the names and semantics of various methods and properties. Views can then rely on this protocol to interact with the object in a generic way.

_Methods that take `num` represents the page number._

### Assertions

Methods are making various assertions about a given page.

- `hasPage(num)` - Returns a boolean for whether `num` is within bounds
- `hasNextPage([num])` - Returns a boolean for whether the current page or `num` has a following page.
- `hasPreviousPage([num])` - Returns a boolean for whether the current page or `num` has a previous page.
- `pageIsLoading([num])` - Returns a boolean for whether the current page or `num` is loading. `undefined` is returned if the page does not exist.

### Pages

Properties and methods for working with the pages.

- `getPage(num, [options])` - Returns a `Page` (or API compatible) object page given `num`. If `num` is out of bounds, `undefined` will be returned.
  - `options.active` - If true, sets `num` as the current page
  - `options.load` - If false, the page will not be initialized
- `getFirstPage([options])` - Uses `getPage` to return the first page
- `getLastPage([options])` - Uses `getPage` to return the last page
- `getNextPage([num], [options])` - Uses `getPage` to return the next page for the current page or `num`
- `getPreviousPage([num], [options])` - Uses `getPage` to return the previous page for the current page or `num`

### Current Page

Properties and methods for working with the _current_ page.

- `currentPageNum` - The current page number
- `getCurrentPage([options])` - Uses `getPage` to return the current page
- `setCurrentPage(num)` - Sets the current page number and triggers a `change:page` event with the page number and options with various flags denoting if the number represents the first or last page.
- `isCurrentPage(num)` - Returns a boolean for whether `num` is the current page
