from django.db import models

class FieldMixin(models.Model):
    "Adds charting components."

    chart_title = models.CharField(max_length=100, null=True, blank=True)
    chart_yaxis = models.CharField(max_length=100, null=True, blank=True)
    chart_xaxis = models.CharField(max_length=100, null=True, blank=True)

    class Meta(object):
        abstract = True
