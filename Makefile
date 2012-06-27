STATIC_DIR = ./cilantro/static/cilantro
COFFEE_DIR = ${STATIC_DIR}/scripts/coffeescript
JS_SRC_DIR = ${STATIC_DIR}/scripts/javascript/src
JS_MIN_DIR = ${STATIC_DIR}/scripts/javascript/min
PID_FILE = .watch-pid

SASS_DIR = ${STATIC_DIR}/stylesheets/scss
CSS_DIR = ${STATIC_DIR}/stylesheets/css

COMPILE_SASS = `which sass` \
			   --scss \
			   --style=compressed \
			   -r ${SASS_DIR}/lib/bourbon/lib/bourbon.rb \
			   ${SASS_DIR}:${CSS_DIR}
COMPILE_COFFEE = `which coffee` -b -o ${JS_SRC_DIR} -c ${COFFEE_DIR}
WATCH_COFFEE = `which coffee` -w -b -o ${JS_SRC_DIR} -c ${COFFEE_DIR}
REQUIRE_OPTIMIZE = `which node` bin/r.js -o ${STATIC_DIR}/scripts/javascript/app.build.js

all: build watch

build: clean sass coffee optimize

sass:
	@echo 'Compiling Sass...'
	@mkdir -p ${CSS_DIR}
	@${COMPILE_SASS} --update

coffee:
	@echo 'Compiling CoffeeScript...'
	@${COMPILE_COFFEE}

watch: unwatch
	@echo 'Watching in the background...'
	@${WATCH_COFFEE} &> /dev/null & echo $$! > ${PID_FILE}
	@${COMPILE_SASS} --watch &> /dev/null & echo $$! >> ${PID_FILE}

unwatch:
	@if [ -f ${PID_FILE} ]; then \
		echo 'Watchers stopped'; \
		for pid in `cat ${PID_FILE}`; do kill -9 $$pid; done; \
		rm ${PID_FILE}; \
	fi;

optimize: clean
	@echo 'Optimizing the javascript...'
	@mkdir -p ${JS_MIN_DIR}
	@${REQUIRE_OPTIMIZE} > /dev/null

clean:
	@rm -rf ${JS_MIN_DIR}

.PHONY: all sass coffee watch unwatch build optimize clean
