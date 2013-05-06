COFFEE_DIR = ${PWD}/coffee
JAVASCRIPT_DIR = ${PWD}/js
EXT_DIR = ${PWD}/extensions
BUILD_DIR = ${PWD}/build
DIST_DIR = ${PWD}/dist
TMPL_DIR = ${PWD}/templates
DIST_SRC_DIR = ${DIST_DIR}/src
DIST_MIN_DIR = ${DIST_DIR}/min
PID_FILE = .watch-pid

SASS_DIR = ${PWD}/scss
CSS_DIR = ${PWD}/css
IMG_DIR = ${PWD}/img

COMPILE_SASS = `which sass` --scss --style=compressed \
			   -r ${SASS_DIR}/lib/bourbon/lib/bourbon.rb \
			   ${SASS_DIR}:${CSS_DIR}


COFFEE_JITTER = `which jitter` ${COFFEE_DIR} ${BUILD_DIR}
COMPILE_COFFEE = `which coffee` -b -o ${BUILD_DIR} -c ${COFFEE_DIR}
WATCH_COFFEE = `which coffee` -w -b -o ${BUILD_DIR} -c ${COFFEE_DIR}


BUILD = `which node` bin/r.js -o build.js
OPTIMIZE = `which node` bin/r.js -o optimize.js

all: combine watch

sass:
	@echo 'Compiling Sass...'
	@mkdir -p ${CSS_DIR}
	@${COMPILE_SASS} --update


coffee:
	@echo 'Compiling CoffeeScript...'
	@${COMPILE_COFFEE}

watch: unwatch
	@echo 'Watching...'
	@${COMPILE_SASS} --watch &> /dev/null & echo $$! >> ${PID_FILE}
	@if which jitter &> /dev/null; then \
		 ${COFFEE_JITTER}; else \
	   ${WATCH_COFFEE} &> /dev/null & echo $$! > ${PID_FILE}; \
		 fi;

unwatch:
	@if [ -f ${PID_FILE} ]; then \
		echo 'Watchers stopped'; \
		for pid in `cat ${PID_FILE}`; do kill -9 $$pid; done; \
		rm ${PID_FILE}; \
	fi;

combine: coffee
	@echo 'Combining JavaScript...'
	@cp -r ${JAVASCRIPT_DIR}/* ${BUILD_DIR}
	@ln -sf ${TMPL_DIR} ${BUILD_DIR}
	@echo 'Putting extensions in place...'
	@rm -f ${BUILD_DIR}/ext
	@if [ -d ${EXT_DIR} ]; then \
	    ln -sf ${EXT_DIR} ${BUILD_DIR}/ext; \
	fi;

src-dist: combine
	@echo 'Creating source distribution...'
	@rm -rf ${DIST_DIR}
	@mkdir -p ${DIST_DIR} ${EXT_DIR}
	@${BUILD} > /dev/null
	@rm -rf ${DIST_SRC_DIR}/templates

dist: src-dist
	@echo 'Creating distribution...'
	@${OPTIMIZE} > /dev/null
	@rm -rf ${DIST_MIN_DIR}/templates

# Legacy alias
optimize: dist


.PHONY: all sass coffee watch unwatch combine src-dist dist optimize
