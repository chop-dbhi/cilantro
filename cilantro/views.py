import json
from django.http import HttpResponse
from django.shortcuts import render
from cilantro.models import UserPreferences


def app(request):
    if hasattr(request, 'user') and request.user.is_authenticated():
        obj, created = UserPreferences.objects.get_or_create(user=request.user)
        preferences = obj.json
        preferences['id'] = obj.pk
    else:
        preferences = {}
    return render(request, 'cilantro/index.html', {
        'user_preferences': json.dumps(preferences),
    })


def preferences(request):
    # Only authenticated users please..
    if not hasattr(request, 'user') or not request.user.is_authenticated():
        return HttpResponse(status=404)

    # Get it, if it exists
    if request.method == 'GET':
        try:
            obj = UserPreferences.objects.get(user=request.user)
            preferences = obj.json
            preferences['id'] = obj.pk
            return HttpResponse(json.dumps(preferences))
        except UserPreferences.DoesNotExist:
            return HttpResponse(status=204)

    # Preferences are being updated
    if request.method == 'PUT':
        preferences = json.loads(request.body)
        preferences.pop('id', None)
        UserPreferences.objects.filter(user=request.user).update(json=preferences)
        return HttpResponse(status=204)

    # First time preferences are being saved
    if request.method == 'POST':
        obj, created = UserPreferences.objects.get_or_create(user=request.user, defaults={
            'json': json.loads(request.body),
        })
        if created:
            return HttpResponse(status=204)

        preferences = obj.json
        preferences['id'] = obj.pk
        return HttpResponse(json.dumps(preferences), status=201)
