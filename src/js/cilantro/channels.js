/* global define */

/*
The channels published to by all Serrano types include:

- `changed` - Published when changes occur to the object on the client.
   For subscribers that can make use of these changes that do not
   require a sync to the server should subscribe to this topic. The
   model itself is published.

- `syncing` - Published before the request is sent during a model save
   and fetch. For elements which need to display a loader this topic
   should be subscribed to in addition to the `synced` topic to turn
   off the loader UI. The model itself is published.

- `synced` - Published after a request has finished and the client has
   been synced with the server. The model and a response code is published
   which is either 'success' or 'error'.

The channels subscribed to by all Serrano types include:

- `pause` - Publishing to this channel will trigger the target object to
   pause syncing with the server until `resume` (see below) is published
   to.

- `resume` - Publishing to this channel will trigger the target object to
   resume syncing with the server if it had been paused (see above).
*/

define({

    FIELD_FOCUS: 'field:focus',
    FIELD_BLUR: 'field:blur',

    CONCEPT_FOCUS: 'concept:focus',
    CONCEPT_BLUR: 'concept:blur',

    CONTEXT_CHANGED: 'context:changed',
    CONTEXT_SYNCING: 'context:syncing',
    CONTEXT_SYNCED: 'context:synced',

    CONTEXT_PAUSE: 'context:pause',
    CONTEXT_RESUME: 'context:resume',

    CONTEXT_CLEAR: 'context:clear',
    CONTEXT_SAVE: 'context:save',

    CONTEXT_REQUIRED: 'context:required',
    CONTEXT_INVALID: 'context:invalid',

    VIEW_CHANGED: 'view:changed',
    VIEW_SYNCING: 'view:syncing',
    VIEW_SYNCED: 'view:synced',

    VIEW_PAUSE: 'view:pause',
    VIEW_RESUME: 'view:resume',

    VIEW_CLEAR: 'view:clear',
    VIEW_SAVE: 'view:save'

});
