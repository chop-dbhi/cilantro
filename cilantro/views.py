import json
from django.http import HttpResponse
from django.shortcuts import render
from cilantro.models import UserPreferences


def app(request):
    if hasattr(request, 'user') and request.user.is_authenticated():
        kwargs = {'user': request.user}
    else:
        kwargs = {'session_key': request.session.session_key}

    obj, created = UserPreferences.objects.get_or_create(**kwargs)
    preferences = obj.json
    preferences['id'] = obj.pk

    return render(request, 'cilantro/index.html', {
        'user_preferences': json.dumps(preferences),
    })


def preferences(request):
    if hasattr(request, 'user') and request.user.is_authenticated():
        kwargs = {'user': request.user}
    else:
        kwargs = {'session_key': request.session.session_key}

    # Get it, if it exists
    if request.method == 'GET':
        try:
            obj = UserPreferences.objects.get(**kwargs)
            preferences = obj.json
            preferences['id'] = obj.pk
            return HttpResponse(json.dumps(preferences))
        except UserPreferences.DoesNotExist:
            return HttpResponse(status=204)

    # Preferences are being updated
    if request.method == 'PUT':
        preferences = json.loads(request.body)
        preferences.pop('id', None)
        UserPreferences.objects.filter(**kwargs).update(json=preferences)
        return HttpResponse(status=204)

    # First time preferences are being saved
    if request.method == 'POST':
        obj, created = UserPreferences.objects.get_or_create(defaults={
            'json': json.loads(request.body),
        }, **kwargs)

        if created:
            return HttpResponse(status=204)

        preferences = obj.json
        preferences['id'] = obj.pk
        return HttpResponse(json.dumps(preferences), status=201)
