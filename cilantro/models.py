import jsonfield
from django.db import models
from django.contrib.sites.models import Site
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from cilantro.managers import SiteConfigurationManager


class SiteConfiguration(models.Model):
    title = models.CharField(max_length=50, blank=True,
        help_text=_('If left blank the name will be derived from the site or the hostname'))
    subtitle = models.CharField(max_length=100, blank=True)
    site_logo = models.FileField(upload_to='cilantro/sites', null=True, blank=True)
    site = models.ForeignKey(Site, related_name='configurations', null=True,
        blank=True, help_text=_('Leave empty to be the default configuration for all sites'))
    footer_content = models.TextField(help_text='Markdown enabled', blank=True)
    google_analytics = models.CharField(max_length=20, null=True, blank=True,
        help_text=_('Just the UA-XXXXXX-XXX code'))

    objects = SiteConfigurationManager()

    def __unicode__(self):
        if self.site_id:
            return u'{0} Site Configuration'.format(self.site)
        return u'Default Site Configuration'

    @property
    def site_name(self):
        return self.name or self.site.name

    @property
    def site_domain(self):
        return self.site.domain


class UserPreferences(models.Model):
    json = jsonfield.JSONField(default=dict)
    user = models.ForeignKey(User, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)

    def __unicode__(self):
        if self.user_id:
            return u'{}\'s Preferences'.format(self.user)
        return u'Preferences for Session [{}]'.format(self.session_key)
