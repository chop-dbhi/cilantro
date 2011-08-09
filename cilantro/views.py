from django.shortcuts import render_to_response
from django.template import RequestContext

from serrano.api.resources import ColumnResourceCollection

def workspace(request):
    return render_to_response('workspace.html',
        context_instance=RequestContext(request))

def define(request):
    return render_to_response('define.html',
        context_instance=RequestContext(request))

def report(request):
    resource = ColumnResourceCollection()
    columns = resource.GET(request)
    return render_to_response('report.html', {
        'columns': columns,
    }, context_instance=RequestContext(request))
