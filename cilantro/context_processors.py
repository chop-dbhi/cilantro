from django.contrib.sites.models import Site

def media(request):
    from django.conf import settings
    CILANTRO_STATIC_URL = getattr(settings, 'CILANTRO_STATIC_URL', None)

    if CILANTRO_STATIC_URL is None:
        CILANTRO_STATIC_URL = settings.STATIC_URL + 'cilantro/'

    _dir = 'src' if settings.DEBUG else 'min'
    CILANTRO_JAVASCRIPT_URL = '%sjavascript/%s/' % (CILANTRO_STATIC_URL, _dir)

    return {
        'CILANTRO_STATIC_URL': CILANTRO_STATIC_URL,
        'CILANTRO_JAVASCRIPT_URL': CILANTRO_JAVASCRIPT_URL
    }

def settings(request):
    site = Site.objects.get_current()
    return {
        'CILANTRO': site.cilantro_settings,
    }
