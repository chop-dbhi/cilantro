from django.conf.urls.defaults import *

urlpatterns = patterns('',
    url(r'^define/$', 'cilantro.views.define', name='define'),
    url(r'^report/$', 'cilantro.views.report', name='report'),
)
