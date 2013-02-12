define ['../../core'], (c) ->

    compiled = _.template '
        <div class="area-container conceptform">
            <h3 class=heading>
                {{ data.name }} <small>{{ data.category }}</small>
            </h3>
            <div class=btn-toolbar>
                <button data-toggle=detail class="btn btn-small"><i class=icon-info-sign></i> Info</button>
                <button data-toggle=hide class="btn btn-small"><i class=icon-minus></i> Hide</button>
            </div>
            <div class=details>
                <div class=description>{{ data.description }}</div>
            </div>
            <form class=form-inline>
            </form>
        </div>
    ', null, variable: 'data'

    class ConceptForm extends c.Marionette.ItemView
        className: 'concept-form'

        template: compiled


    { ConceptForm }
