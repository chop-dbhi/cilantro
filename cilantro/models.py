from django.db import models
from django.contrib.sites.models import Site
from django.utils.translation import ugettext as _
from cilantro.managers import SettingsManager

class Settings(models.Model):
    name = models.CharField('Site name', max_length=50, blank=True,
        help_text=_('If left blank the name will be derived from the site or '
        'the hostname'))
    site_logo = models.ImageField(upload_to='cilantro/settings', null=True, blank=True)
    site = models.ForeignKey(Site, related_name='cilantro_settings', null=True, blank=True,
        help_text=_('Leave empty to be the default settings for all sites'))
    footer_content = models.TextField(help_text='Markdown enabled', blank=True)
    google_analytics = models.CharField(max_length=20, null=True, blank=True,
        help_text=_('Just the UA-XXXXXX-XXX code'))

    objects = SettingsManager()

    class Meta(object):
        verbose_name_plural = 'settings'

    def __unicode__(self):
        return u'Cilantro Settings'

    @property
    def site_name(self):
        return self.name or self.site.name

    @property
    def site_domain(self):
        return self.site.domain
