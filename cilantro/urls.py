from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^(?:discover/|analyze/|review/|activity/)?$', 'django.views.generic.simple.direct_to_template', {
        'template': 'cilantro/index.html',
    }),
)
