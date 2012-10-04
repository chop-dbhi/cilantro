from django.conf.urls import url, patterns, include

urlpatterns = patterns('',
    url(r'', include(patterns('',
        url(r'^workspace/$', 'cilantro.views.app', name='workspace'),
        url(r'^discover/$', 'cilantro.views.app', name='discover'),
        url(r'^analyze/$', 'cilantro.views.app', name='analyze'),
        url(r'^review/$', 'cilantro.views.app', name='review'),
        url(r'^activity/$', 'cilantro.views.app', name='activity'),
        url(r'^api/preferences/$', 'cilantro.views.preferences', name='preferences'),
    ), namespace='cilantro')),
)
