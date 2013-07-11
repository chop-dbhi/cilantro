/*
 * All source files are created and managed by type in `src`.
 *
 * There three output directories:
 *
 *  - `local` - Development and testing
 *  - `build` - Intermediate directory prior to optimizations and/or
 *      concatentation
 *  - `dist` - Final output for release purposes. This carries over
 *      to the master branch to be copied in the root of the repo.
 *
 *  Each Grunt task has a target named `local` which performs copying,
 *  compiling or symlinking in the `local` directory for development.
 *  Additional targets may be defined for `build` or `dist` depending on
 *  the requirements.
 *
 *  Shared options for a task should be defined first, followed by each
 *  task entry. Each task can define it's own set of options to override
 *  the shared ones defined for the task.
 *
 */

module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({

        pkg: pkg,

        srcDir: 'src',
        specDir: 'spec',

        localDir: 'local',
        buildDir: 'build',
        distDir: 'dist',

        connect: {
            server: {
                options: {
                    host: '127.0.0.1',
                    port: 8125
                }
            }
        },

        watch: {
            coffee: {
                tasks: ['coffee:local'],
                files: [
                    '<%= srcDir %>/coffee/**/*'
                ]
            },

            tests: {
                tasks: ['jasmine:local:build'],
                files: ['<%= specDir %>/**/*']
            },

            sass: {
                tasks: ['sass:local'],
                files: ['<%= srcDir %>/scss/**/*']
            }
        },

        coffee: {
            options: {
                bare: true,
            },

            // Output to 'local' for development
            local: {
                options: {
                    sourceMap: true
                },
                expand: true,
                cwd: '<%= srcDir %>/coffee',
                dest: '<%= localDir %>/js',
                src: '**/*.coffee',
                rename: function(dest, src) {
                    return dest + '/' + src.replace('.coffee', '.js');
                }
            },

            // Compiles files to the 'build' directory for distribution
            build: {
                expand: true,
                cwd: '<%= srcDir %>/coffee',
                dest: '<%= buildDir %>/js',
                src: '**/*.coffee',
                rename: function(dest, src) {
                    return dest + '/' + src.replace('.coffee', '.js');
                }
            }
        },

        sass: {
            local: {
                options: {
                    trace: true,
                    sourcemap: true
                },
                files: {
                    '<%= localDir %>/css/style.css': '<%= srcDir %>/scss/style.scss'
                }
            },

            dist: {
                options: {
                    quiet: true,
                    style: 'compressed'
                },
                files: {
                    '<%= distDir %>/css/style.css': '<%= srcDir %>/scss/style.scss'
                }
            }
        },

        copy: {
            local: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= srcDir %>/js',
                        src: ['**/*'],
                        dest: '<%= localDir %>/js'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcDir %>/css',
                        src: ['**/*'],
                        dest: '<%= localDir %>/css'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcDir %>/font',
                        src: ['**/*'],
                        dest: '<%= localDir %>/font'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcDir %>/img',
                        src: ['**/*'],
                        dest: '<%= localDir %>/img'
                    }
                ]
            },

            build: {
                files: [
                     {
                        expand: true,
                        cwd: '<%= srcDir %>/templates',
                        src: ['**/*'],
                        dest: '<%= buildDir %>/js/templates'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcDir %>/js',
                        src: ['**/*'],
                        dest: '<%= buildDir %>/js'
                    }
                ]
            },

            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= srcDir %>/css',
                        src: ['**/*'],
                        dest: '<%= distDir %>/css'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcDir %>/font',
                        src: ['**/*'],
                        dest: '<%= distDir %>/font'
                    },
                    {
                        expand: true,
                        cwd: '<%= srcDir %>/img',
                        src: ['**/*'],
                        dest: '<%= distDir %>/img'
                    },
                    {
                        expand: true,
                        src: ['bower.json', 'package.json'],
                        dest: '<%= distDir %>'
                    }
                ]
            }
        },

        // Only applicable for development, e.g. local
        symlink: {
            options: {
                type: 'dir'
            },

            templates: {
                relativeSrc: '../../<%= srcDir %>/templates',
                dest: '<%= localDir %>/js/templates'
            },

            extensions: {
                relativeSrc: '../../<%= srcDir %>/extensions',
                dest: '<%= localDir %>/js/extensions'
            }
        },

        requirejs: {
            options: {
                baseUrl: '.',
                inlineText: true,
                preserveLicenseComments: false,
                wrap: false,
                logLevel: 1,
                throwWhen: {
                    optimize: true
                },

                // RequireJS plugin configs
                config: {
                    tpl: {
                        variable: 'data'
                    }
                },

                modules: [{
                    name: 'cilantro',
                    include: ['cilantro/ui']
                }],

                // Post analysis of built files
                done: function(done, output) {
                    var dups = require('rjs-build-analysis').duplicates(output);

                    if (dups.length > 0) {
                        grunt.log.subhead('Duplicates found in RequireJS build:');
                        grunt.log.warn(dups);
                        done(new Error('r.js built duplicate modules, please check the `excludes` option.'));
                    }

                    done();
                }
            },

            dist: {
                options: {
                    appDir: 'build/js',
                    dir: 'dist/js',
                    optimize: 'uglify2',
                    removeCombined: true
                }
            }
        },

        // Removes output directories
        clean: {
            local: ['local'],
            build: ['build'],
            dist: ['dist'],
            postdist: [
                '<%= distDir %>/js/templates',
                '<%= distDir %>/js/build.txt'
            ]
        },

        jasmine : {
            options : {
                specs : '<%= specDir %>/**/*',
                host: 'http://127.0.0.1:8125',
                keepRunner: true,
                template: require('grunt-template-jasmine-requirejs'),
            },

            local: {
                options: {
                    templateOptions: {
                        requireConfig: {
                            baseUrl: '<%= localDir %>/js',
                            config: {
                                tpl: {
                                    variable: 'data'
                                }
                            }
                        }
                    }
                }
            },

            dist: {
                options: {
                    templateOptions: {
                        requireConfig: {
                            baseUrl: '<%= distDir %>/js',
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
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-symlink');

    grunt.registerTask('local', [
        'sass:local',
        'coffee:local',
        'copy:local',
        'symlink',
        'jasmine:local:build'
    ]);

    grunt.registerTask('dist', [
        'clean:build',
        'coffee:build',
        'copy:build',
        'clean:dist',
        'requirejs:dist',
        'sass:dist',
        'copy:dist',
        'clean:postdist'
    ]);

    grunt.registerTask('work', [
        'local',
        'watch'
    ]);

    grunt.registerTask('test', [
        'local',
        'connect',
        'jasmine:local'
    ]);


    var shell = require('shelljs');

    function run(cmd) {
        grunt.log.ok(cmd);
        shell.exec(cmd);
    }

    grunt.registerTask('tag-release', 'Create a release on master', function() {
        run('git checkout master');
        run('rm -rf font css img js');
        run('cp -r dist/* .');
        run('git add .');
        run('git commit -m "' + pkg.version + ' Release"');
        run('git tag ' + pkg.version);
    });

    grunt.registerTask('release', [
        'dist',
        'tag-release'
    ]);

};
