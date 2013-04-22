module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    jasmine : {
      tests: {
      src : 'build/**/*.js',
      options : {
        specs : 'spec/**/*Spec.js',
        vendor: [
            '/build/jquery.js',
            '/spec/lib/jasmine-jquery.js',
            '/spec/lib/jasmine.async.js',
            '/spec/lib/mock-ajax.js'
        ],
        host: 'http://127.0.0.1:8125/',
        template:'spec/runner.tmpl',
        outfile: 'spec-runner.html',
        templateOptions:{
          requireConfig: {
             baseUrl: 'build/',
             config: {
                 tpl: {
                     variable: 'data'
                 }
             }
          }
        }
      }
     }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['jasmine']);
};

