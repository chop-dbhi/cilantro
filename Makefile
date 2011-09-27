STATIC_DIR = cilantro/static
COFFEE_DIR = ${STATIC_DIR}/coffee
JS_SRC_DIR = ${STATIC_DIR}/js/src
JS_MIN_DIR = ${STATIC_DIR}/js/min

SASS_DIR = ${STATIC_DIR}/scss
CSS_DIR = ${STATIC_DIR}/css

COMPILE_SASS = `which sass` \
			   --scss \
			   --style=compressed \
			   --watch ${SASS_DIR}:${CSS_DIR} \
			   -r ${STATIC_DIR}/scss/bourbon/lib/bourbon.rb
COMPILE_COFFEE = `which coffee` -b -o ${JS_SRC_DIR} -c ${COFFEE_DIR}
REQUIRE_OPTIMIZE = `which node` bin/r.js -o cilantro/static/js/app.build.js

all: sass compile optimize

sass:
	@@echo 'Compiling Sass...'
	@@mkdir -p ${CSS_DIR}
	${COMPILE_SASS}

coffee:
	@@echo 'Compiling CoffeeScript...'
	${COMPILE_COFFEE} > /dev/null

optimize:
	@@echo 'Optimizing...'
	@@mkdir -p ${JS_MIN_DIR}
	${REQUIRE_OPTIMIZE} > /dev/null

clean:
	@@rm -rf ${OPTIMIZED_DIR}
	@@rm -rf ${CSS_DIR}

.PHONY: all sass coffee optimize clean