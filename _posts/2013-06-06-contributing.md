---
layout: page
title: "Contributing"
category: dev
date: 2013-06-06 16:36:26
order: 1
---

The first step in contributing to the code base is [forking the repo](https://help.github.com/articles/fork-a-repo). If you have an existing fork, make the repo is up-to-date by fetching and rebasing against primary branch to resolve any conflicts. Always create new branches off the actively developed branch which is typically named after the current major version, e.g. _2.x_.

For coding style guideline, please refer to [CBMi's style guide for CoffeeScript](https://github.com/cbmi/style-guides/blob/master/coffeescript.md). In addition, the Cilantro codebase follows a [set of conventions]({% post_url 2013-06-06-conventions %}), so please review them prior to writing code to prevent duplicating your work.

**For bug fixes:**

- Create a branch
- Once the bug has been fixed with sufficient testing submit a [pull request](https://help.github.com/articles/using-pull-requests)
- If there is an existing open issue, reference the issue number in the pull request description.

**For new features:**

Open a ticket thoroughly describing the feature. The more detail you provide, the better. After at least one of core developers responds or triages the ticket and says it's a go, follow the steps:

- Create a branch
- Once implemented with tests and documentation, submit a pull request referencing the open ticket.

**For documentation:**

- Create a branch or [edit the file directly](https://help.github.com/articles/creating-and-editing-files-in-your-repository#changing-files-you-dont-own)
- Submit a pull request
