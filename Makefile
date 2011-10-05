STATIC_DIR = cilantro/static
COFFEE_DIR = ${STATIC_DIR}/coffee
JS_SRC_DIR = ${STATIC_DIR}/js/src
JS_MIN_DIR = ${STATIC_DIR}/js/min
PID_FILE = /tmp/cilantro-watch

HIGHCHARTS_SM = ${STATIC_DIR}/highcharts

SASS_DIR = ${STATIC_DIR}/scss
CSS_DIR = ${STATIC_DIR}/css

COMPILE_SASS = `which sass` \
			   --scss \
			   --style=compressed \
			   --watch ${SASS_DIR}:${CSS_DIR} \
			   -r ${STATIC_DIR}/scss/coriander/bourbon/lib/bourbon.rb
COMPILE_COFFEE = `which coffee` -w -b -o ${JS_SRC_DIR} -c ${COFFEE_DIR}
REQUIRE_OPTIMIZE = `which node` bin/r.js -o cilantro/static/js/app.build.js

HIGHCHARTS_TAG = 4a32faec62d449a67ff3343f985d62a8d2dfcb74

all: sass coffee highcharts optimize

watch: unwatch
	@echo 'Watching in the background...'
	@${COMPILE_COFFEE} &> /dev/null & echo $$! > ${PID_FILE}
	@${COMPILE_SASS} &> /dev/null & echo $$! >> ${PID_FILE}

unwatch:
	@if [ -f ${PID_FILE} ]; then \
		echo 'Watchers stopped'; \
		for pid in `cat ${PID_FILE}`; do kill -9 $$pid; done; \
		rm ${PID_FILE}; \
	fi;

sass:
	@echo 'Compiling Sass...'
	@mkdir -p ${CSS_DIR}
	@${COMPILE_SASS}

coffee:
	@echo 'Compiling CoffeeScript...'
	@${COMPILE_COFFEE}

highcharts:
	@echo 'Updating HighCharts...'
	@cd ${HIGHCHARTS_SM} && git checkout ${HIGHCHARTS_TAG}
	@cp ${HIGHCHARTS_SM}/js/highcharts.src.js ${JS_SRC_DIR}/lib/highcharts.js

optimize:
	@echo 'Optimizing...'
	@mkdir -p ${JS_MIN_DIR}
	@${REQUIRE_OPTIMIZE} > /dev/null

clean:
	@rm -rf ${OPTIMIZED_DIR}
	@rm -rf ${CSS_DIR}

.PHONY: all watch unwatch sass coffee optimize clean
