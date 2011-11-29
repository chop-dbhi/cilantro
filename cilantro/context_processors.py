from cilantro.models import Settings

def media(request):
    from django.conf import settings
    static_url = getattr(settings, 'CILANTRO_STATIC_URL', None)

    if static_url is None:
        static_url = settings.STATIC_URL + 'cilantro/'

    javascript_url = '{0}scripts/javascript/{1}/'.format(static_url,
        'src' if settings.DEBUG else 'min')

    css_url = '{0}stylesheets/css/'.format(static_url)

    return {
        'CILANTRO_STATIC_URL': static_url,
        'CILANTRO_JAVASCRIPT_URL': javascript_url,
        'CILANTRO_CSS_URL': css_url,
    }

def settings(request):
    settings = Settings.objects.get_current(request)
    return {
        'CILANTRO': settings
    }
