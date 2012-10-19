import json
from django.http import HttpResponse
from django.shortcuts import render
from preserialize.serialize import serialize
from cilantro.models import UserPreferences


template = {
    'fields': [':pk', 'json']
}


def app(request):
    return render(request, 'cilantro/index.html')


def preferences(request):
    # Get a user's preferences
    if hasattr(request, 'user') and request.user.is_authenticated():
        kwargs = {'user': request.user}
    # Get this session's preferences
    elif request.session.session_key:
        kwargs = {'session_key': request.session.session_key}
    # Bots..
    else:
        return HttpResponse(status=204)

    # Creating the preferences are transparent, create them if they
    # don't already exist for this user or session.
    preferences, created = UserPreferences.objects.get_or_create(**kwargs)

    if request.method == 'GET':
        return HttpResponse(json.dumps(serialize(preferences, **template)))

    if request.method == 'PUT':
        data = json.loads(request.body)
        data.pop('id', None)
        preferences.json = data
        preferences.save()
        return HttpResponse(status=204)

    return HttpResponse(status=405)
