from avocado.criteria.viewset import AbstractViewSet, library

CHART_TYPES = ['string','number','nullboolean','boolean']

@library.register
class DefaultViewSet(AbstractViewSet):
    """Constructs a single view with some sensible interpretation of the fields.

    A few assumptions are made when determining the appropriate view to be
    provided::

        - if the ``concept`` contains a single field, a chart is constructed

        - if all of the ``concept's`` fields are required, no chart is
        constructed, since none of the fields seemingly take precendence over
        each other

        - if *not* all of the ``concept's`` fields are required, a chart is
        constructed for the first field (by the order specified)

    """
    def _get_coords(self, field, **kwargs):
        if field.datatype in ("string", "nullboolean"):
            coords = field.distribution(**kwargs)
        else:
            coords = field.distribution(order_by='count', exclude=(None,), **kwargs)
        return coords

    def _is_chartable(self, field):
        if field.datatype in CHART_TYPES:
            # we don't want free text to be graphed
            if field.datatype == 'string' and not field.enable_choices:
                return False
            return True
        return False

    def default_view(self, concept, cfields, *args, **kwargs):
        chart_enabled = False
        elements = []

        form = {
            'type': 'form',
            'fields': [],
        }

        if len(cfields) == 1 or not all([f.required for f in cfields]):
            cfield_0 = cfields[0]
            choices = cfield_0.field.choices
            # only specify a chart if the field is required and is able
            # to be charted
            if cfield_0.required and self._is_chartable(cfield_0.field) and (choices is None or len(choices) <= 15):
                
                cfield_0 = cfields.pop(0)
                field = cfield_0.field
                
                chart = {
                    'type': 'chart',
                    'data': {
                        'datatype': field.datatype,
                        'title': field.chart_title or field.name,
                        'coords': self._get_coords(field),
                        'xaxis': field.chart_xaxis,
                        'yaxis': field.chart_yaxis,
                        'pk' :  field.pk,
                        'name': cfield_0.get_name(),
                        'optional': not cfield_0.required,
                        'choices': field.choices
                    }
                }
                elements.append(chart)

        for cfield in cfields:
            optional = not cfield.required
            field = cfield.field

            row = {
                'name' : cfield.get_name(),
                'datatype' : field.datatype,
                'choices' : field.choices,
                'pk': field.pk,
                'optional' : optional
            }
            form['fields'].append(row)


        if form['fields']:
            elements.append(form)

        viewset = {
            'type': 'builtin',
            'elements': elements
        }

        return viewset

library.default = DefaultViewSet()
