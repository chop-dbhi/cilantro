---
layout: page
title: "Pub Sub Channels"
category: ref
date: 2013-06-06 16:36:26
---

Cilantro utilizes the publish/subscribe pattern to decouple application state and events from the components on the page. For readability and consistency, channels are namespaced using the period as a delimiter, e.g. 'session.closed'. All core channels are accessible as constants (the recommended way of referencing them) on the `cilantro` object, e.g. `cilantro.SESSION_OPENED`, where the periods are replaced with underscores and characters are capitalized.

## session.opening

Published when the session is opening. Read more about [Sessions]({{ site.baseurl }}{% post_url 2013-06-06-sessions%}).

## session.error

Published when a session-level error has occurred such as opening a session.

## session.unauthorized

For session that require authorization, this channel is published to when authorization has failed.

## session.opened

Published when the session has been successfully opened.

## session.closed

Published when the session has been closed.
