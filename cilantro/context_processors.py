from django.conf import settings

def media(request):
    CILANTRO_MEDIA_URL = getattr(settings, 'CILANTRO_MEDIA_URL',
        settings.MEDIA_URL)
    CILANTRO_JS_URL = getattr(settings, 'CILANTRO_JS_URL', None)
    
    if CILANTRO_JS_URL is None:
        SRC_DIR = getattr(settings, 'SRC_DIR', 'src')
        MIN_DIR = getattr(settings, 'MIN_DIR', 'min')
        _dir = settings.DEBUG and SRC_DIR or MIN_DIR
        CILANTRO_JS_URL = '%sjs/%s/' % (CILANTRO_MEDIA_URL, _dir)

    return {
        'CILANTRO_MEDIA_URL': CILANTRO_MEDIA_URL,
        'CILANTRO_JS_URL': CILANTRO_JS_URL
    }
