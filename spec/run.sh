#!/bin/bash
# Please checkout phantome-jasmine (https://github.com/jcarver989/phantom-jasmine) into this directory
# Requires that phantomjs be on the path
phantomjs phantom-jasmine/lib/run_jasmine_test.coffee http://localhost:8125/tests/jasmine/ConsoleRunner.html

