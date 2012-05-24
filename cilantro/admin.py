from django.contrib import admin
from cilantro.models import SiteConfiguration, UserPreferences

admin.site.register(SiteConfiguration)
admin.site.register(UserPreferences)
