from django.conf.urls.defaults import *

urlpatterns = patterns('',
    url(r'^workspace/$', 'cilantro.views.workspace', name='workspace'),
    url(r'^define/$', 'cilantro.views.define', name='define'),
    url(r'^report/$', 'cilantro.views.report', name='report'),
)
