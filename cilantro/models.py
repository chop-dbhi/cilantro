from django.db import models
from django.contrib.sites.models import Site

class Settings(models.Model):
    site = models.OneToOneField(Site, related_name='cilantro_settings')
    site_logo = models.ImageField(upload_to='cilantro/settings', null=True)
    footer_content = models.TextField(null=True, help_text='Markdown enabled')
    google_analytics = models.CharField(max_length=20, null=True,
        help_text='Just the UA-XXXXXX-XXX code')

    class Meta(object):
        verbose_name_plural = 'settings'

    def __unicode__(self):
        return u'Cilantro Settings'

    @property
    def site_name(self):
        return self.site.name

    @property
    def site_domain(self):
        return self.site.domain
