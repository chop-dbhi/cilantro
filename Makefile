COFFEE_DIR = cilantro/static/coffee
OUTPUT_DIR = cilantro/static/js/src
OPTIMIZED_DIR = cilantro/static/js/min

COMPILER = `which coffee` -b -s -p
OPTIMIZER = `which node` bin/r.js -o cilantro/static/js/app.build.js

WORKSPACE_MODULES = ${COFFEE_DIR}/workspace/main.coffee

DEFINE_MODULES = ${COFFEE_DIR}/define/main.coffee \
				 ${COFFEE_DIR}/define/controller.coffee \
				 ${COFFEE_DIR}/define/domain.coffee \
				 ${COFFEE_DIR}/define/subdomain.coffee \
				 ${COFFEE_DIR}/define/concept.coffee \
				 ${COFFEE_DIR}/define/report.coffee \
				 ${COFFEE_DIR}/define/app.coffee

REPORT_MODULES = ${COFFEE_DIR}/report/main.coffee \
				 ${COFFEE_DIR}/report/domain.coffee \
				 ${COFFEE_DIR}/report/subdomain.coffee \
				 ${COFFEE_DIR}/report/concept.coffee \
				 ${COFFEE_DIR}/report/app.coffee

all: workspace define report optimize

workspace:
	@@echo 'Compiling "Workspace" page...'
	@@mkdir -p ${OUTPUT_DIR}/workspace
	@@cat ${WORKSPACE_MODULES} | ${COMPILER} > ${OUTPUT_DIR}/workspace/main.js

define:
	@@echo 'Compiling "Define" page...'
	@@mkdir -p ${OUTPUT_DIR}/define
	@@cat ${DEFINE_MODULES} | ${COMPILER} > ${OUTPUT_DIR}/define/main.js

report:
	@@echo 'Compiling "Report" page...'
	@@mkdir -p ${OUTPUT_DIR}/report
	@@cat ${REPORT_MODULES} | ${COMPILER} > ${OUTPUT_DIR}/report/main.js

compile: workspace define report

optimize:
	@@echo 'Optimizing...'
	@@mkdir -p ${OPTIMIZED_DIR}
	${OPTIMIZER} > /dev/null

clean:
	@@rm -rf ${OPTIMIZED_DIR}


.PHONY: all workspace define report compile optimize clean
