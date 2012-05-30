from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^(?:discover/|analyze/|review/|activity/)?$', 'cilantro.views.app'),
    url(r'^api/preferences/$', 'cilantro.views.preferences'),
)
