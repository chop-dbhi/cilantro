from django.conf.urls.defaults import *

urlpatterns = patterns('cilantro.views',
    url(r'^redirect/$', 'login_redirect', name='login-redirect'),
    url(r'^workspace/$', 'workspace', name='workspace'),
    url(r'^define/$', 'define', name='define'),
    url(r'^report/$', 'report', name='report'),
)
