define ['common/models/polling', 'common/views/collection', 'vendor/synapse'], (polling, collectionview) ->

    class ReportCollection extends polling.Collection
        url: App.urls.reports


    class ReportView extends Backbone.View
        el: '<li><strong role="name"></strong> - modified '
            '<span role="modified"></span><span role="timesince"></span></li>'

        elements:
            '[role=name]': 'name'
            '[role=modified]': 'modified'
            '[role=timesince]': 'timesince'

        render: ->
            Synapse(@model).notify(@name).notify(@modified)


    class ReportCollectionView extends collectionview.View
        el: '#reports ul'
        viewClass: ReportView


    return {
        Collection: ReportCollection
        CollectionView: ReportCollectionView
    }
