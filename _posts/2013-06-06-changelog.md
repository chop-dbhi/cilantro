---
layout: page
title: "Changelog"
category: dev
date: 2013-06-06 16:36:26
order: 1
---

### 2.0.1

- Add initial support for _stacked_ columns in the query and results workflows

### 2.0.0

- Initial release of the Cilantro _thin_ client

Prior to this release, Cilantro was a Django app which caused it to be less flexible as a general purpose set of client tools for consuming Serrano APIs. The goal of the refactor was drop this server-side dependency completely and to focus on building modular JavaScript components that can be used even outside of the _default_ Cilantro workflows.

Being that this is a pure JavaScript library now, there are a few caveats when migrating.

- There is no Cilantro-specific data persistance
  - The `SiteConfiguration` and `UserPreferences` models have been removed
  - All configuration options are defined in JavaScript
- There is no longer a default UI (the Django templates have been removed)
  - Cilantro is designed to be _dropped in_ to an existing template and thus can be more easily integrated in existing HTML
