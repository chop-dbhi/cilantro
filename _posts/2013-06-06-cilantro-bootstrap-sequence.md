---
layout: page
title: "Cilantro Bootstrap Sequence"
category: ref
date: 2013-06-06 16:36:26
---

# Intent
This page will describe the sequence of events in the code that bootstrap the cilantro session within the gallery app (most of this will be applicable to any web application that wants to use the Cilantro API). This information will be useful both for debugging existing code and creating a custom Cilantro client. This article will follow the code through the path of obtaining existing Context objects (filters the user previously applied) residing within the session for the current user, but the path is similar for obtaining other server-side models like concepts and fields.

# Sequence of Events
## gallery/index.html
Everything begins in `gallery/index.html`. This sets up the Cilantro configuration object on the main window object. The idea here is that we configure some basic Cilantro settings on the window and when the Cilantro library loads it will find and use them. A basic configuration looks like this

```javascript
var cilantro = {
    url: '/mock/root.json',
    autoload: true,
    concepts: {
        forms: {
            31: {
                module: 'ext/vocab/scripts/javascript/src/vocabulary'
            }
        }
    }
};
```

The gallery app is a little strange here in that it uses static JavaScript files containing mock data for the url parameter. A real application would most likely point to a server api endpoint. _Importantly, the process of initiating a session to the server will retrieve the configuration at this endpoint and make it available to the client_. Read on for details on this process.

The bottom of the `gallery/index.html` instructs require.js to load `gallery/main.js`.

## gallery/main.js

This file contains a lot of code specific to the gallery app, but the important part appears towards the bottom where we see 

```javascript
require(['cilantro'], function(c) {
```

This part will start the chain of events that will load the Cilantro library and establish a session with your server.

## cilantro.coffee

The require statement in main.js will cause the main body of this file to execute. It is small but does quite a bit so I will provide a summarized version of it here.

```coffeescript
define [
    './cilantro/core'
    './cilantro/models'
], (c, models) ->

   c.models = models

   c.data =
       concepts: new models.ConceptCollection
       fields: new models.FieldCollection
       contexts: new models.ContextCollection
       views: new models.ViewCollection
    
   if c.getOption('autoload') then c.openSession()

   return (@cilantro = c)
```

It includes two more files, including the models file. This will fetch all the client-side models that Cilantro uses, including the ContextModel, which will be the focus of the rest of this article. All the models are placed on the main Cilantro convenience object, "c" for later reference. It then instantiates a series of backbone model collections. We will follow the path executed by the line `new models.ContextCollection`.

## cilantro/models/context.coffee

This ContextCollection object instantiated in the above file (cilantro.coffee) is declared in here towards the bottom. We see that the url endpoint for this backbone collection is set by calling `c.getSessionUrl("contexts")`.  This value, while not known at this point in time,  will be derived from the original cilantro configuration object set on the window object. The url attribute there points to the main server configuration api endpoint, and the endpoints for all of the other major Cilantro objects (including contexts) are declared in the configuration returned there. You can see an example of what this looks like by looking in the `mock/root.json` (which is the configuration that the gallery app uses). This values will be available on the client once the session to the server has been opened.

The constructor for the collection subscribes to the SESSION_OPENED event, and instructs the collection to fetch the data from its url endpoint when this event has been published.

## Back in cilantro.coffee

We return from instantiated the model collections and then check to see if `autoload` was set on the cilantro configuration object. Most of the time it will be, and `c.openSession()` is executed.

## cilantro/core.coffee

The openSession function called above is declared in core.coffee. It is made available on the convenience 'c' object because cilantro.coffee requires core.coffee at the top. The openSession function refers to the url attribute set in the cilantro configuration object and issues the call `session.openSession` call that initiates contact with the server, which will return the main server configuration object (described above, among other things, containing the endpoint for the context objects on the server). 

## cilantro/session.coffee

The openSession function in this file actually performs the ajax call to the server. Importantly, in addition, as contact with the server is attempted and received, it publishes the relevant SESSION_ events. When it publishes SESSION_OPENED, the ContextCollection object described above will initiate its fetch to the context api endpoint (which is now known, because the main server config has been returned to the client) and retrieve any existing Context objects on the server. Once this process has completed, most of the Cilantro library has bootstrapped and other modules (such as forms) will be able to use the Context objects to populate and display existing queries to the user.
