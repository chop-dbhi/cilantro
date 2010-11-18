#!/bin/sh

# defines the JS modules located in the JS_SRC_DIR that will be compiled
# and written to the JS_MIN_DIR
MODULES=("login" "define/main" "report/main")


# absolute path where this script is located
DIST_DIR=$(cd $(dirname "$0"); pwd)

# path to the base JavaScript directory
JS_DIR=$DIST_DIR/../avoclient/static/js

# path to the source JavaScript files 
JS_SRC_DIR=$JS_DIR/src

# path to the output directory
JS_MIN_DIR=$JS_DIR/min

NUM=${#MODULES[@]}

for (( i=0; i<$NUM; i++ )); do
    module=${MODULES[${i}]}

    $DIST_DIR/build/build.sh \
        name=$module \
        out=$JS_MIN_DIR/$module.js \
        baseUrl=$JS_SRC_DIR
done
