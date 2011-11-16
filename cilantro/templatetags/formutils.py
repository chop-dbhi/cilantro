from django import template
from django.forms import widgets

register = template.Library()

@register.inclusion_tag('formfield.html')
def formfield(field):
    widget = field.field.widget

    if isinstance(widget, widgets.Input):
        input_type = 'input'
    elif isinstance(widget, widgets.Textarea):
        input_type = 'textarea'
    elif isinstance(widget, widgets.Select):
        input_type = 'select'
    elif isinstance(widget, widgets.CheckboxInput):
        input_type = 'checkbox'
    elif isinstance(widget, widgets.RadioInput):
        input_type = 'radio'
    else:
        input_type = None

    return {'field': field, 'form': field.form, 'type': input_type}
