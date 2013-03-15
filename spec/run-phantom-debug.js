#!/bin/bash
phantomjs --remote-debugger-port=9000 phantom-adapters/run-jasmine.js http://localhost:8125/tests/jasmine/ConsoleRunner.html
