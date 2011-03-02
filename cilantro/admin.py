from avocado.fields.admin import FieldAdmin

class ChartEnabledFieldAdmin(FieldAdmin):
    fieldsets = FieldAdmin.fieldsets[:1] + (
        ('Charting Attributes', {
            'fields': ('chart_title', 'chart_xaxis', 'chart_yaxis'),
        }),
    ) + FieldAdmin.fieldsets[1:]
