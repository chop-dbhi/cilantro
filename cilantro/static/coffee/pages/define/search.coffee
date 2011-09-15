define [
        'common/views/state'
        'cilantro/utils/search'
    ],
    
    (stateview, Search) ->

        class ResultCollection extends Search.ResultCollection
            url: App.urls.criteria


        class ResultItemView extends stateview.View
            template: _.template '<span class="name"><%= name %></span>
                <br><span class="info"><%= domain.name %></span>'

            events:
                'click': 'click'

            render: ->
                @el.html @template @model.toJSON()
                @

            click: ->
                App.hub.publish 'concept/request', @model.id
                return false


        class InputView extends Search.InputView
            el: '#concept-search'


        class ResultListView extends Search.ResultListView
            el: '#concept-search-results'
            viewClass: ResultItemView
            inputViewClass: InputView


        return {
            ResultCollection: ResultCollection
            ResultListView: ResultListView
        }
