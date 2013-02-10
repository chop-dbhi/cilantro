COFFEE_DIR = ./coffee
JAVASCRIPT_DIR = ./js
TMP_DIR = ./tmp
BUILD_DIR = ./build
DIST_DIR = ./dist
PID_FILE = .watch-pid

CLIENT_DIR = ./client
CLIENT_SASS_DIR = ${CLIENT_DIR}/scss
CLIENT_CSS_DIR = ${CLIENT_DIR}/css
CLIENT_JS_DIR = ${CLIENT_DIR}/js

COMPILE_SASS = `which sass` --scss --style=compressed \
			   -r ${CLIENT_SASS_DIR}/lib/bourbon/lib/bourbon.rb \
			   ${CLIENT_SASS_DIR}:${CLIENT_CSS_DIR}

COMPILE_COFFEE = `which coffee` -b -o ${TMP_DIR} -c ${COFFEE_DIR}
WATCH_COFFEE = `which coffee` -w -b -o ${TMP_DIR} -c ${COFFEE_DIR}

BUILD = `which node` bin/r.js -o build.js
OPTIMIZE = `which node` bin/r.js -o optimize.js

all: build watch

client: optimize sass coffee
	@echo 'Building client assests...'
	@rm -rf ${CLIENT_JS_DIR}
	@cp -r ${DIST_DIR} ${CLIENT_JS_DIR}

sass:
	@echo 'Compiling Sass...'
	@mkdir -p ${CLIENT_CSS_DIR}
	@${COMPILE_SASS} --update

coffee:
	@echo 'Compiling CoffeeScript...'
	@${COMPILE_COFFEE}

watch: unwatch
	@echo 'Watching...'
	@${WATCH_COFFEE} &> /dev/null & echo $$! > ${PID_FILE}
	@${COMPILE_SASS} --watch &> /dev/null & echo $$! >> ${PID_FILE}

unwatch:
	@if [ -f ${PID_FILE} ]; then \
		echo 'Watchers stopped'; \
		for pid in `cat ${PID_FILE}`; do kill -9 $$pid; done; \
		rm ${PID_FILE}; \
	fi;

build: coffee
	@echo 'Building javascript...'
	@rm -rf ${BUILD_DIR}
	@mkdir -p ${BUILD_DIR}
	@cp -r ${JAVASCRIPT_DIR}/* ${TMP_DIR}
	@${BUILD} > /dev/null

optimize: build
	@echo 'Optimizing javascript...'
	@rm -rf ${DIST_DIR}
	@mkdir -p ${DIST_DIR}
	@${OPTIMIZE} > /dev/null



.PHONY: all client sass coffee watch unwatch build optimize
