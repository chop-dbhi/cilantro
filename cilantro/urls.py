from django.conf.urls.defaults import patterns, url
from django.template.loader import add_to_builtins

add_to_builtins('cilantro.templatetags.formutils')

urlpatterns = patterns('cilantro.views',
    url(r'^redirect/$', 'login_redirect', name='login-redirect'),
    url(r'^workspace/$', 'workspace', name='workspace'),
    url(r'^define/$', 'define', name='define'),
    url(r'^report/$', 'report', name='report'),
)
