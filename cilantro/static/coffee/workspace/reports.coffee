    class Reports extends polling.Collection
        url: App.urls.reports


    class ReportListItem extends Backbone.View
        el: '<li><strong role="name"></strong> - modified '
            '<span role="modified"></span><span role="timesince"></span></li>'

        elements:
            '[role=name]': 'name'
            '[role=modified]': 'modified'
            '[role=timesince]': 'timesince'

        render: ->
            Synapse(@model).notify(@name).notify(@timesince).notify(@modified)


    class ReportList extends collectionview.View
        el: '#reports ul'
        viewClass: ReportListItem

