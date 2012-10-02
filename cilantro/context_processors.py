import os
from cilantro.models import SiteConfiguration


def cilantro(request):
    from django.conf import settings

    static_url = os.path.join(settings.STATIC_URL, 'cilantro')

    css_url = '{}/stylesheets/css'.format(static_url)
    images_url = '{}/images'.format(static_url)
    javascript_url = '{}/scripts/javascript'.format(static_url)

    # Augment output version (for debugging purposes)
    if settings.DEBUG:
        javascript_url += '/src'
    else:
        javascript_url += '/min'

    try:
        config = SiteConfiguration.objects.get_current(request)
    except SiteConfiguration.DoesNotExist:
        config = None

    return {
        'cilantro': {
            'config': config,
            'static_url': static_url,
            'css_url': css_url,
            'images_url': images_url,
            'javascript_url': javascript_url,
        },
    }
