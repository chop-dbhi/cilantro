COFFEE_DIR = ${PWD}/coffee
JAVASCRIPT_DIR = ${PWD}/js
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
	@echo 'Compiling extensions Sass...'
	@for dir in ${PWD}/extensions/*/; do \
	    ext=`basename $${dir%*/}`; mkdir -p ${CSS_DIR}/$$ext; \
        `which sass` --scss --style=compressed \
		-r ${SASS_DIR}/lib/bourbon/lib/bourbon.rb \
		${PWD}/extensions/$$ext/scss:${CSS_DIR}/$$ext --update; done;
	@echo 'Putting extension images in place...'
	@for dir in ${PWD}/extensions/*/; do \
	    ext=`basename $${dir%*/}`; mkdir -p ${IMG_DIR}/$$ext; \
	   	cp ${PWD}/extensions/$$ext/img/*.* ${IMG_DIR}/$$ext; done;


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
	@echo 'Putting extension JavaScript templates in place...'
	@for dir in ${PWD}/extensions/*/; do \
	    ext=`basename $${dir%*/}`; mkdir -p ${TMPL_DIR}/$$ext; \
	   	cp ${PWD}/extensions/$$ext/templates/*.html ${TMPL_DIR}/$$ext; done;

optimize: combine
	@echo 'Optimizing JavaScript...'
	@rm -rf ${DIST_DIR}
	@mkdir -p ${DIST_DIR}
	@${BUILD} > /dev/null
	@rm -rf ${DIST_SRC_DIR}/templates
	@${OPTIMIZE} > /dev/null
	@rm -rf ${DIST_MIN_DIR}/templates


.PHONY: all sass coffee watch unwatch combine optimize
