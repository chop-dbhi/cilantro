from django.shortcuts import render_to_response, redirect
from django.template import RequestContext

from avocado.models import Report
from avocado.modeltree import trees, DEFAULT_MODELTREE_ALIAS
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
    # XXX: hack.. page components are not yet dynamic
    model_name_plural = trees[DEFAULT_MODELTREE_ALIAS].root_model._meta.verbose_name_plural.format()
    return render_to_response('report.html', {
        'columns': columns,
        'model_name_plural': model_name_plural,
    }, context_instance=RequestContext(request))
