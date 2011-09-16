Build Dependencies
------------------
- Node - ``brew install node`` (you are using [Homebrew][1] right?)
- CoffeeScript - ``npm install coffee-script -g``
- UglifyJS - ``npm install uglify-js -g``
- Sass - ``gem install sass``

[1]: http://mxcl.github.com/homebrew/

Fancy Makefile
--------------
- Compile Sass/SCSS - ``make sass``
- Compile CoffeeScript - ``make coffee`` (I made a funny)
- Optimize JavaScript - ``make optimize``
- Remove compiled code - ``make clean``, note this does not currently remove
the raw JavaScript files since not all code has been ported to CoffeeScript
