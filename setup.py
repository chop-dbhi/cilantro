from setuptools import setup, find_packages

kwargs = {
    # Packages
    'packages': find_packages(),
    'include_package_data': True,

    # Dependencies
    'install_requires': [
        'serrano>=2.0,<2.1',
    ],

    # Test dependencies
    'tests_require': [
        'coverage',
    ],

    # Optional dependencies
    'extras_require': {},

    # Metadata
    'name': 'cilantro',
    'version': __import__('cilantro').get_version(),
    'author': 'Byron Ruth',
    'author_email': 'b@devel.io',
    'description': 'A client implementation for Serrano 2.x',
    'license': 'BSD',
    'keywords': 'harvest serrano client avocado',
    'url': 'http://cbmi.github.com/cilantro',
    'classifiers': [
        'Development Status :: 4 - Beta',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python :: 2.7',
        'Framework :: Django',
        'Topic :: Internet :: WWW/HTTP',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Intended Audience :: Healthcare Industry',
        'Intended Audience :: Information Technology',
    ],
}

setup(**kwargs)
