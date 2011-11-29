from django.db import models
from django.conf import settings
from django.contrib.sites.models import Site

class SettingsManager(models.Manager):
    def get_current(self, request=None):
        obj = self.model()

        if Site._meta.installed:
            try:
                obj = super(SettingsManager, self).get(site__id=settings.SITE_ID)
            except self.model.DoesNotExist:
                try:
                    obj = super(SettingsManager, self).get(site=None)
                except self.model.DoesNotExist:
                    pass

        # if no site is associated, attach a dynamic RequestSite object
        if not obj.site and request:
            host = request.get_host()
            obj.site = Site(name=host, domain=host)

        return obj
