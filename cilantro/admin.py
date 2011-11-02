from django.contrib import admin
from cilantro.models import Settings
from avocado.fields.admin import FieldAdmin
from avocado.models import Field

class ChartEnabledFieldAdmin(FieldAdmin):
    fieldsets = FieldAdmin.fieldsets[:1] + (
        ('Chart Labels', {
            'classes': ('collapse',),
            'fields': ('chart_title', 'chart_xaxis', 'chart_yaxis'),
        }),
    ) + FieldAdmin.fieldsets[1:]


admin.site.unregister(Field)
admin.site.register(Field, ChartEnabledFieldAdmin)
admin.site.register(Settings)
