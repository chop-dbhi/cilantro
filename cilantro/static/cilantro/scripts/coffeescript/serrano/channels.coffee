# The channels published to by all Serrano types include:
#
#   - `changed` - Published when changes occur to the object on the client.
#       For subscribers that can make use of these changes that do not
#       require a sync to the server should subscribe to this topic. The
#       model itself is published.
#
#   - `syncing` - Published before the request is sent during a model save
#       and fetch. For elements which need to display a loader this topic
#       should be subscribed to in addition to the `synced` topic to turn
#       off the loader UI. The model itself is published.
#
#   - `synced` - Published after a request has finished and the client has
#       been synced with the server. The model and a response code is published
#       which is either 'success' or 'error'.
#
# The channels subscribed to by all Serrano types include:
#
#   - `pause` - Publishing to this channel will trigger the target object to
#       pause syncing with the server until `resume` (see below) is published
#       to.
#
#   - `resume` - Publishing to this channel will trigger the target object to
#       resume syncing with the server if it had been paused (see above).

define ->

    # Published by DataContext
    DATACONTEXT_CHANGED: 'datacontext/changed'
    DATACONTEXT_SYNCING: 'datacontext/syncing'
    DATACONTEXT_SYNCED: 'datacontext/synced'

    # Subscribed by DataContexts
    DATACONTEXT_PAUSE: 'datacontext/pause'
    DATACONTEXT_RESUME: 'datacontext/resume'

    # Specific to the DataContext to enable add and removing nodes from
    # the tree. Both take a node (remove can also take just a node CID) as
    # well as a flag to sync immediately with the server.
    DATACONTEXT_ADD: 'datacontext/add'
    DATACONTEXT_REMOVE: 'datacontext/remove'
    DATACONTEXT_CLEAR: 'datacontext/clear'

    DATACONTEXT_HISTORY: 'datacontext/history'

    # Published by DataViews
    DATAVIEW_CHANGED: 'dataview/changed'
    DATAVIEW_SYNCING: 'dataview/syncing'
    DATAVIEW_SYNCED: 'dataview/synced'

    # Subscribed by DataViews
    DATAVIEW_PAUSE: 'dataview/pause'
    DATAVIEW_RESUME: 'dataview/resume'

    # Speicifc to the DataView to enable setting the output columns
    # and sorting options.
    DATAVIEW_COLUMNS: 'dataview/columns'
    DATAVIEW_ORDERING: 'dataview/ordering'

    DATAVIEW_HISTORY: 'dataview/history'
