from django.conf import settings

MIN_DIR = 'min'
SRC_DIR = 'src'

def media(request):
    CILANTRO_MEDIA_URL = getattr(settings, 'CILANTRO_MEDIA_URL',
        None)

    if CILANTRO_MEDIA_URL is None:
        CILANTRO_MEDIA_URL = settings.MEDIA_URL + 'client/'

    CILANTRO_JS_URL = '%sjs/%s/' % (CILANTRO_MEDIA_URL,
        settings.DEBUG and SRC_DIR or MIN_DIR)

    return {
        'CILANTRO_MEDIA_URL': CILANTRO_MEDIA_URL,
        'CILANTRO_JS_URL': CILANTRO_JS_URL
    }
