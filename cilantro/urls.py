from django.conf.urls import url, patterns, include

urlpatterns = patterns('',
    url(r'', include(patterns('',
        url(r'^api/preferences/$', 'cilantro.views.preferences', name='preferences'),
    ), namespace='cilantro')),
)
