from django.conf.urls.defaults import *

urlpatterns = patterns('',
    # authentication    
    url(r'^login/$', 'avoclient.views.login',
        {'template_name': 'login.html'}, name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout_then_login', name='logout'),

    url(r'^define/$', 'avoclient.views.define', name='define'),
    url(r'^report/$', 'avoclient.views.report', name='report'),
)
