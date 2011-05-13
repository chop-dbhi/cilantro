from django.conf import settings

def media(request):
    CILANTRO_MEDIA_URL = getattr(settings, 'CILANTRO_MEDIA_URL',
        None)

    if CILANTRO_MEDIA_URL is None:
        CILANTRO_MEDIA_URL = settings.MEDIA_URL + 'cilantro/'

    _dir = 'src' if settings.DEBUG else 'min'
    CILANTRO_JS_URL = '%sjs/%s/' % (CILANTRO_MEDIA_URL, _dir)

    return {
        'CILANTRO_MEDIA_URL': CILANTRO_MEDIA_URL,
        'CILANTRO_JS_URL': CILANTRO_JS_URL
    }
