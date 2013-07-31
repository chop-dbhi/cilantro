define [
    '../core'
    '../base'
    '../paginator'
    '../numbers'
    '../../structs'
    '../../models'
    '../tables'
    '../context'
    '../concept'
    '../exporter'
    'tpl!templates/count.html'
    'tpl!templates/workflows/results.html'
], (c, base, paginator, numbers, structs, models, tables, context, concept, exporter, templates...) ->

    templates = c._.object ['count', 'results'], templates


    class ResultCount extends c.Marionette.ItemView
        tagName: 'span'

        className: 'result-count'

        template: templates.count

        ui:
            count: '.count'
            label: '.count-label'

        modelEvents:
            'change:objectcount': 'renderCount'

        renderCount: (model, count, options) ->
            numbers.renderCount(@ui.count, count)
            @ui.label.text('records')


    class ResultsWorkflow extends c.Marionette.Layout
        className: 'results-workflow'

        template: templates.results

        requestDelay: 2500      # In milliseconds
        requestTimeout: 10000   # Max time(ms) for unmonitored exports
        monitorDelay: 500       # In milliseconds
        monitorTimeout: 60000   # Max time(ms) to monitor exports
        numPendingDownloads: 0
        pageRangePattern: /^[0-9]+(\.\.\.[0-9]+)?$/

        ui:
            columns: '.columns-modal'
            exportOptions: '.export-options-modal'
            exportProgress: '.export-progress-modal'
            navbar: '.result-workflow-navbar'

        events:
            'click .columns-modal [data-save]': 'saveColumns'
            'click .columns-modal [data-dismiss]': 'cancelColumnChanges'
            'click .toolbar [data-toggle=columns]': 'showColumns'
            'click .export-options-modal [data-save]': 'exportData'
            'click [data-toggle=export-options]': 'showExportOptions'
            'click [data-toggle=export-progress]': 'showExportProgress'
            'click #pages-text-ranges': 'selectPagesOption'

        regions:
            count: '.count-region'
            table: '.table-region'
            paginator: '.paginator-region'
            context: '.context-region'
            columns: '.columns-modal .modal-body'
            exportTypes: '.export-options-modal .export-type-region'
            exportProgress: '.export-progress-modal .export-progress-region'

        initialize: ->
            $(document).on 'scroll', @onPageScroll

            @monitors = {}

            c.subscribe c.SESSION_OPENED, () ->
                if c.isSerranoOutdated()
                    $('.serrano-version-warning').show()

        onPageScroll: =>
            # If the view isn't rendered yet, then don't bother
            if @isClosed
                return

            scrollPos = $(document).scrollTop()

            if @ui.navbar.hasClass('navbar-fixed-top')
                if scrollPos < (@navbarVerticalOffset - @topNavbarHeight)
                    # Remove the results navbar from the top
                    @ui.navbar.removeClass('navbar-fixed-top')
            else
                if scrollPos >= (@navbarVerticalOffset - @topNavbarHeight)
                    # Move the results navbar to the top
                    @ui.navbar.css('top', @topNavbarHeight)
                    @ui.navbar.addClass('navbar-fixed-top')

        selectPagesOption: ->
            $('#pages-radio-all').prop('checked', false)
            $('#pages-radio-ranges').prop('checked', true)
            $('#pages-text-ranges').val('')

        changeExportStatus: (title, newState) ->
            statusContainer = $(".export-status-#{ title } .span10")

            statusContainer.children().hide()

            switch newState
                when "pending"
                    statusContainer.find('.pending-container').show()
                when "downloading"
                    statusContainer.find('.progress').show()
                when "error"
                    statusContainer.find('.label-important').show()
                when "success"
                    statusContainer.find('.label-success').show()

        onExportFinished: (exportTypeTitle) =>
            @numPendingDownloads = @numPendingDownloads - 1
            $('.export-progress-container .badge-info').html(@numPendingDownloads)

            if @hasExportErrorOccurred(exportTypeTitle)
                @changeExportStatus(exportTypeTitle, "error")
            else
                @changeExportStatus(exportTypeTitle, "success")

            # If all the downloads are finished, re-enable the export button
            if @numPendingDownloads == 0
                $('[data-toggle=export-options]').prop('disabled', false)
                $('.export-progress-container').hide()

        hasExportErrorOccurred: (exportTypeTitle) ->
            id = "#export-download-#{ exportTypeTitle }"

            # Since we can't read the content-type of the iframe directly,
            # we need to check to see if the body of the iframe is populated.
            # If it is populated, then an error during export has occurred and
            # the details of that error are contained in the iframe. If all
            # went well, the iframe will have empty head and body elements
            # because the content disposition was attachment.
            if $(id).contents()[0].body.children.length == 0
                false
            else
                true

        checkExportStatus: (exportTypeTitle) =>
            @monitors[exportTypeTitle]["execution_time"] =
                @monitors[exportTypeTitle]["execution_time"] + @monitorDelay

            cookieName = "export-type-#{ exportTypeTitle.toLowerCase() }"

            # Check if the download finished and the cookie was set
            if @getCookie(cookieName) == "complete"
                clearInterval(@monitors[exportTypeTitle]["interval"])
                @setCookie(cookieName, null)
                @onExportFinished(exportTypeTitle)

            # Check for a timeout, if we reached this point, we don't really
            # know what is going on so assume we missed something and the
            # download finished so take the best guess as to the result. Also,
            # check for an error. If an error occurred then kill the monitor
            # and send it to the completed handler.
            else if (@monitors[exportTypeTitle]["execution_time"] > @monitorTimeout or
                     @hasExportErrorOccurred(exportTypeTitle))
                clearInterval(@monitors[exportTypeTitle]["interval"])
                @onExportFinished(exportTypeTitle)

        setCookie: (name, value) ->
            document.cookie= "#{ name }=#{ escape(value) }; path=/"

        getCookie: (name) ->
            # Code adapted from JS on this page:
            #   http://www.w3schools.com/js/js_cookies.asp
            value = document.cookie
            startIndex = value.indexOf(" #{ name }=")

            if startIndex == -1
                startIndex = value.indexOf("#{ name }=")

            if startIndex == -1
                value = null
            else
                startIndex = value.indexOf("=", startIndex) + 1
                endIndex = value.indexOf(";", startIndex)
                if endIndex == -1
                    endIndex = value.length
                value = unescape(value.substring(startIndex, endIndex))

            return value

        startExport: (exportType, pages) =>
            title = $(exportType).attr('title')
            @changeExportStatus(title, "downloading")

            # Clear the cookie in case the Serrano version is new enough
            # to be setting the cookie in response.
            cookieName = "export-type-#{ title.toLowerCase() }"
            @setCookie(cookieName, null)

            url = $(exportType).attr('href')
            if url[url.length-1] != "/"
                url = "#{ url }/"
            url = "#{ url }#{ pages }"

            iframe = "<iframe id=export-download-#{ title } src=#{ url } style='display: none'></iframe>"
            $('.export-iframe-container').append(iframe)

            if c.data.exporters.notifiesOnComplete()
                @monitors[title] = {}
                @monitors[title]["execution_time"] = 0
                @monitors[title]["interval"] = setInterval(
                    @checkExportStatus,
                    @monitorDelay,
                    title)
            else
                setTimeout(
                    @onExportFinished,
                    @requestTimeout,
                    title)

        initializeExportStatusIndicators: (selectedTypes) ->
            # Start by hiding all of them
            $('.export-status-container').children().hide()

            for st in selectedTypes
                $(".export-status-#{ st.title }").show()

        isPageRangeValid: ->
            if $('input[name=pages-radio]:checked').val() == "all"
                return true
            else
                pageRange = $('#pages-text-ranges').val()

                return @pageRangePattern.test(pageRange)

        exportData: (event) ->
            # Clear any of the old iframes. If we are exporting again, these
            # downloads should all have finished based on the UI blocking
            # during active exports.
            $('.export-iframe-container').html('')

            selectedTypes = $('input[name=export-type-checkbox]:checked')

            if selectedTypes.length == 0
                $('#export-error-message').html('An export type must be selected.')
                $('.export-options-modal .alert-block').show()
            else if not @isPageRangeValid()
                $('#export-error-message').html('Page range is invalid. Must be a single page(example: 1) or a range of pages(example: 2...5).')
                $('.export-options-modal .alert-block').show()
            else
                @numPendingDownloads = selectedTypes.length

                pagesSuffix = ""
                if $('input[name=pages-radio]:checked').val() != "all"
                    pagesSuffix = $('#pages-text-ranges').val() + "/"

                # Disable export button until the downloads finish
                $("[data-toggle=export-options]").prop('disabled', true)
                $('.export-progress-container').show()
                $('.export-progress-container .badge-info').html(@numPendingDownloads)

                @ui.exportOptions.modal('hide')

                @initializeExportStatusIndicators(selectedTypes)

                @ui.exportProgress.modal('show')

                # Introduce an artificial delay in between download requests
                # to keep the browser from freaking out about too many
                # simultaneous download requests. We go slower for unmonitored
                # downloads because we don't know for sure when a download
                # completes so we need to give it plenty of time to finish
                # before we make a judgement call on the download. Essentially
                # if the server notifies on complete, we use parallel(to a
                # degree) downloads, otherwise, we take a more serial approach.
                delay = @requestDelay
                if not c.data.exporters.notifiesOnComplete()
                    delay = @requestTimeout
                for i in [0..selectedTypes.length-1] by 1
                    @changeExportStatus(
                        $(selectedTypes[i]).attr('title'), "pending")

                    setTimeout(@startExport, i * delay, selectedTypes[i], pagesSuffix)

        onRender: ->
            @paginator.show new paginator.Paginator
                model: c.data.results

            @count.show new ResultCount
                model: c.data.results

            @context.show new base.LoadView
                message: 'Loading session context...'

            @columns.show new base.LoadView
                message: 'Loading all your query options...'

            @exportTypes.show new exporter.ExportTypeCollection
                collection: c.data.exporters

            @exportProgress.show new exporter.ExportProgressCollection
                collection: c.data.exporters

            c.data.contexts.ready =>
                @context.show new context.ContextPanel
                    model: c.data.contexts.getSession()

                @context.currentView.$el.stacked
                    fluid: '.tree-region'

            c.data.concepts.ready =>
                c.data.views.ready =>
                    @table.show new tables.Table
                        view: c.data.views.getSession()
                        collection: c.data.results

                    @columns.show new concept.ConceptColumns
                        view: c.data.views.getSession()
                        collection: c.data.concepts.viewable

            # Record the vertical offset of the masthead nav bar if we
            # haven't done so already. This is used in scroll calculations.
            if not @navbarVerticalOffset?
                @navbarVerticalOffset = @ui.navbar.offset().top

            # If there is already something fixed to the top, record the height
            # of it so we can account for it in our scroll calculations later.
            if not @topNavbarHeight
                topElement = $('.navbar-fixed-top')
                if topElement.length
                    @topNavbarHeight = topElement.height()
                else
                    @topNavbarHeight = 0

        showExportOptions: ->
            $('.export-options-modal .alert-block').hide()
            @ui.exportOptions.modal('show')

            if (c.data.exporters.length == 0)
                $('.export-options-modal .btn-primary').prop('disabled', true)

        showExportProgress: ->
            @ui.exportProgress.modal('show')

        showColumns: ->
            @ui.columns.modal('show')

        cancelColumnChanges: ->
            c._.delay =>
                @columns.currentView.updateView(c.data.views.getSession())
            , 25

        saveColumns: ->
            c.data.views.getSession().facets = @columns.currentView.facets.clone()
            c.publish c.VIEW_SAVE
            @ui.columns.modal('hide')


    { ResultsWorkflow }
