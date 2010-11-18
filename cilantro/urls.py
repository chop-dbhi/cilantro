from django.conf.urls.defaults import *

urlpatterns = patterns('',
    # authentication    
    url(r'^login/$', 'cilantro.views.login',
        {'template_name': 'login.html'}, name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout_then_login', name='logout'),

    url(r'^define/$', 'cilantro.views.define', name='define'),
    url(r'^report/$', 'cilantro.views.report', name='report'),
)
