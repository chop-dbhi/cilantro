#!/bin/sh

PACKAGE="cilantro"

# defines the JS modules located in the JS_SRC_DIR that will be compiled
# and written to the JS_MIN_DIR
MODULES=("login/main" "define/main" "report/main")

# absolute path where this script is located
DIST_DIR=$(cd $(dirname "$0"); pwd)

# path to the base JavaScript directory
JS_DIR=$DIST_DIR/../$PACKAGE/static/js

# path to the source JavaScript files 
JS_SRC_DIR=$JS_DIR/src

# path to the output directory
JS_MIN_DIR=$JS_DIR/min

NUM=${#MODULES[@]}

# iterate over each module and run the RequireJS build optimizer for it
for (( i=0; i<$NUM; i++ )); do
    module=${MODULES[${i}]}

    $DIST_DIR/build/build.sh \
        name=$module \
        out=$JS_MIN_DIR/$module.js \
        baseUrl=$JS_SRC_DIR
done

# the source directory of Sass/SCSS files
SASS_DIR=$DIST_DIR/../$PACKAGE/static/sass

# the CSS directory for ouput
CSS_DIR=$DIST_DIR/../$PACKAGE/static/css

# compress all CSS
sass --scss --no-cache --update --style compressed $SASS_DIR:$CSS_DIR
