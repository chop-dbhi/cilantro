from django.conf import settings

def media(request):
    CILANTRO_STATIC_URL = getattr(settings, 'CILANTRO_STATIC_URL',
        None)

    if CILANTRO_STATIC_URL is None:
        CILANTRO_STATIC_URL = settings.STATIC_URL + 'cilantro/'

    _dir = 'src' if settings.DEBUG else 'min'
    CILANTRO_JS_URL = '%sjs/%s/' % (CILANTRO_STATIC_URL, _dir)

    return {
        'CILANTRO_STATIC_URL': CILANTRO_STATIC_URL,
        'CILANTRO_JS_URL': CILANTRO_JS_URL
    }
