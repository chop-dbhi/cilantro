STATIC_DIR = cilantro/static
COFFEE_DIR = ${STATIC_DIR}/coffee
JS_SRC_DIR = ${STATIC_DIR}/javascript/src
JS_MIN_DIR = ${STATIC_DIR}/javascript/min
PID_FILE = .watch-pid

HIGHCHARTS_SM = ${STATIC_DIR}/highcharts

SASS_DIR = ${STATIC_DIR}/scss
CSS_DIR = ${STATIC_DIR}/css

COMPILE_SASS = `which sass` \
			   --scss \
			   --style=compressed \
			   -r ${STATIC_DIR}/scss/coriander/bourbon/lib/bourbon.rb \
			   ${SASS_DIR}:${CSS_DIR}
COMPILE_COFFEE = `which coffee` -b -o ${JS_SRC_DIR} -c ${COFFEE_DIR}
WATCH_COFFEE = `which coffee` -w -b -o ${JS_SRC_DIR} -c ${COFFEE_DIR}
REQUIRE_OPTIMIZE = `which node` bin/r.js -o cilantro/static/javascript/app.build.js

LATEST_TAG = `git describe --tags \`git rev-list --tags --max-count=1\``

all: build-submodules watch

build: build-submodules sass coffee optimize

dist: build
	@echo 'Creating a source distributions...'
	@python setup.py sdist > /dev/null

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

init-submodules:
	@echo 'Initializing submodules...'
	@if [ -d .git ]; then \
		if git submodule status | grep -q -E '^-'; then \
			git submodule update --init --recursive; \
		else \
			git submodule update --init --recursive --merge; \
		fi; \
	fi;

build-submodules: init-submodules coriander backbone-common jquery-idle-timeout highcharts

coriander:
	@echo 'Setting up submodule coriander...'
	@rm -rf ${STATIC_DIR}/scss/coriander
	@cp -r ./modules/coriander ${STATIC_DIR}/scss/coriander

backbone-common:
	@echo 'Setting up submodule backbone-common...'
	@rm -rf ${STATIC_DIR}/coffee/common
	@cp -r ./modules/backbone-common ${STATIC_DIR}/coffee/common

jquery-idle-timeout:
	@echo 'Setting up submodule jquery-idle-timeout...'
	@cat ./modules/jquery-idle-timeout/src/*.js > ${JS_SRC_DIR}/vendor/jquery.idle.js

highcharts:
	@echo 'Setting up submodule highcharts...'
	@cp ./modules/highcharts/js/highcharts.src.js ${JS_SRC_DIR}/vendor/highcharts.js

optimize: clean
	@echo 'Optimizing the javascript...'
	@mkdir -p ${JS_MIN_DIR}
	@${REQUIRE_OPTIMIZE} > /dev/null

clean:
	@rm -rf ${JS_MIN_DIR}

.PHONY: all sass coffee watch unwatch build optimize clean
