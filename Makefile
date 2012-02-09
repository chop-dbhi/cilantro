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
			   -r ${SASS_DIR}/coriander/bourbon/lib/bourbon.rb \
			   ${SASS_DIR}:${CSS_DIR}
COMPILE_COFFEE = `which coffee` -b -o ${JS_SRC_DIR} -c ${COFFEE_DIR}
WATCH_COFFEE = `which coffee` -w -b -o ${JS_SRC_DIR} -c ${COFFEE_DIR}
REQUIRE_OPTIMIZE = `which node` bin/r.js -o ${STATIC_DIR}/scripts/javascript/app.build.js

LATEST_TAG = `git describe --tags \`git rev-list --tags --max-count=1\``

all: build watch

build: clean build-submodules sass coffee optimize

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

build-submodules: init-submodules coriander backbone-common jquery-idle-timeout highcharts \
	requirejs rjs backbone underscore pubsub

coriander:
	@echo 'Setting up Coriander...'
	@rm -rf ${SASS_DIR}/coriander
	@cp -r ./modules/coriander ${SASS_DIR}/coriander

backbone-common:
	@echo 'Setting up Backbone-common...'
	@rm -rf ${COFFEE_DIR}/common
	@cp -r ./modules/backbone-common ${COFFEE_DIR}/common

jquery-idle-timeout:
	@echo 'Setting up jQuery-idle-timeout...'
	@cat ./modules/jquery-idle-timeout/src/*.js > ${JS_SRC_DIR}/vendor/jquery.idle.js

highcharts:
	@echo 'Setting up Highcharts...'
	@cp ./modules/highcharts/js/highcharts.src.js ${JS_SRC_DIR}/vendor/highcharts.js

requirejs:
	@echo 'Setting up RequireJS...'
	@cp ./modules/requirejs/require.js ${JS_SRC_DIR}/vendor/require.js
	@cp ./modules/requirejs/order.js ${JS_SRC_DIR}/order.js

rjs:
	@echo 'Setting up r.js...'
	@cd ./modules/rjs && node dist.js
	@mkdir -p ./bin
	@cp ./modules/rjs/r.js ./bin

jquery:
	@echo 'Setting up jQuery...'
	@cd ./modules/jquery && make
	@cp ./modules/jquery/dist/jquery.js ${JS_SRC_DIR}/vendor/jquery.js

backbone:
	@echo 'Setting up Backbone...'
	@cp ./modules/backbone/backbone.js ${JS_SRC_DIR}/vendor/backbone.js

underscore:
	@echo 'Setting up Underscore...'
	@cp ./modules/underscore/underscore.js ${JS_SRC_DIR}/vendor/underscore.js

pubsub:
	@echo 'Setting up PubSub...'
	@cd ./modules/pubsub && make
	@cp ./modules/pubsub/dist/pubsub.js ${JS_SRC_DIR}/vendor/pubsub.js

optimize:
	@echo 'Optimizing the javascript...'
	@rm -rf ${JS_MIN_DIR}
	@mkdir -p ${JS_MIN_DIR}
	@${REQUIRE_OPTIMIZE} > /dev/null

clean:
	@rm -rf ${JS_MIN_DIR}

.PHONY: all sass coffee watch unwatch build optimize clean
