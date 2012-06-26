import distribute_setup
distribute_setup.use_setuptools()
from setuptools import setup, find_packages

kwargs = {
    # Packages
    'packages': find_packages(),
    'include_package_data': True,

    # Dependencies
    'install_requires': [
        'serrano>=2.0a',  # Hack, to work with the dependency link
    ],

    # Test dependencies
    'tests_require': [
        'coverage',
    ],

    # Optional dependencies
    'extras_require': {},

    # Resources unavailable on PyPi
    'dependency_links': [
        'https://github.com/cbmi/serrano/tarball/2.x#egg=serrano-2.0',
    ],

    # Metadata
    'name': 'cilantro',
    'version': __import__('cilantro').get_version(),
    'author': 'Byron Ruth',
    'author_email': 'b@devel.io',
    'description': 'A client implementation for Serrano 2.x',
    'license': 'BSD',
    'keywords': 'snippets tools utilities',
    'url': 'https://github.com/cbmi/cilantro',
    'classifiers': [
        'Development Status :: 4 - Beta',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python :: 2.7'
        'Framework :: Django',
        'Topic :: Internet :: WWW/HTTP',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Intended Audience :: Healthcare Industry',
        'Intended Audience :: Information Technology',
    ],
}

setup(**kwargs)
