from django.shortcuts import render_to_response, redirect
from django.template import RequestContext

from avocado.models import Report
from serrano.api.resources import ColumnResourceCollection

def login_redirect(request):
    # if the user does not have any saved queries, redirect to the define
    # page instead of the their workspace
    if not Report.objects.filter(user=request.user, session=False).count():
        return redirect('define')
    return redirect('workspace')

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
