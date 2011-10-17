Installation
------------
To install one of the stable or nightly builds, download a
source distributions here: https://github.com/cbmi/django-cilantro-pre/downloads

Build From Source
-----------------
Dependencies:

- Node - ``brew install node`` (you are using [Homebrew][1] right?)
- CoffeeScript - ``npm install coffee-script -g``
- UglifyJS - ``npm install uglify-js -g``
- Sass - ``gem install sass``

[1]: http://mxcl.github.com/homebrew/

Due to the numerous build dependencies, Cilantro cannot be installed
blindly using pip from git e.g. you cannot do this:
``pip install git+git://github.com/cbmi/django-cilantro-pre``

If you wish run the bleeding edge version (or a particular branch), follow
these steps (unix only):

1. Clone the repository
2. Install all deps listed above
3. Run ``make build``
4. Run ``python setup.py install``

Every time you pull new changes you must perform steps (3) and (4).

Fancy Makefile Targets
----------------------
- Initialize and Watch - ``make [all]`` - initializes and updates all submodules
and sets each one up according to their Makefile target
- Build for Installation/Distribution - ``make build``
- Compile Sass/SCSS - ``make sass``
- Compile CoffeeScript - ``make coffee`` (I made a funny)
- Optimize JavaScript - ``make optimize``
- Remove compiled code - ``make clean``, note this does not currently remove
the raw JavaScript files since not all code has been ported to CoffeeScript
- Watch/Unwatch - ``make watch``, starts the coffee and sass processes (node
and ruby) in the background, use ``make unwatch`` to stop these processes
