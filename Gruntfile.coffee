# All source files are created and managed by type in `src`.
#
# There three output directories:
#
# - `local` - Development and testing
# - `build` - Intermediate directory prior to optimizations and/or
#     concatentation
# - `dist` - Final output for release purposes. This carries over to the master
#     branch to be copied in the root of the repo.
#
# Each Grunt task has a target named `local` which performs copying,
# compiling or symlinking in the `local` directory for development.
# Additional targets may be defined for `build` or `dist` depending on
# the requirements.
#
# Shared options for a task should be defined first, followed by each
# task entry. Each task can define it's own set of options to override
# the shared ones defined for the task.

module.exports = (grunt) ->

    shell = require('shelljs')

    pkg = grunt.file.readJSON('package.json')

    run = (cmd) ->
        grunt.log.ok cmd
        shell.exec cmd

    grunt.initConfig
        pkg: pkg

        srcDir: 'src'
        specDir: 'spec'
        localDir: 'local'
        buildDir: 'build'
        distDir: 'dist'

        serve:
            forever:
                options:
                    keepalive: true
                    port: 8125

            jasmine:
                options:
                    port: 8126

        watch:
            grunt:
                tasks: ['jasmine:local:build']
                files: ['Gruntfile.coffee']

            coffee:
                tasks: ['coffee:local']
                files: ['<%= srcDir %>/coffee/**/*']

            js:
                tasks: ['copy:local']
                files: [
                    '<%= srcDir %>/js/**/*'
                    '<%= srcDir %>/css/**/*'
                    '<%= srcDir %>/font/**/*'
                    '<%= srcDir %>/img/**/*'
                ]

            tests:
                tasks: ['jasmine:local:build']
                files: ['<%= specDir %>/**/*']

            sass:
                tasks: ['sass:local']
                files: ['<%= srcDir %>/scss/**/*']


        coffee:
            options:
                bare: true

            # Output to 'local' for development
            local:
                options:
                    sourceMap: true

                expand: true
                cwd: '<%= srcDir %>/coffee'
                dest: '<%= localDir %>/js'
                src: '**/*.coffee'
                rename: (dest, src) ->
                    dest + '/' + src.replace('.coffee', '.js')

            # Compiles files to the 'build' directory for distribution
            build:
                expand: true
                cwd: '<%= srcDir %>/coffee'
                dest: '<%= buildDir %>/js'
                src: '**/*.coffee'
                rename: (dest, src) ->
                    dest + '/' + src.replace('.coffee', '.js')


        sass:
            local:
                options:
                    trace: true
                    sourcemap: true

                files:
                    '<%= localDir %>/css/style.css': '<%= srcDir %>/scss/style.scss'

            dist:
                options:
                    quiet: true
                    style: 'compressed'

                files:
                    '<%= distDir %>/css/style.css': '<%= srcDir %>/scss/style.scss'


        copy:
            local:
                files: [
                    expand: true
                    cwd: '<%= srcDir %>/js'
                    src: ['**/*']
                    dest: '<%= localDir %>/js'
                ,
                    expand: true
                    cwd: '<%= srcDir %>/css'
                    src: ['**/*']
                    dest: '<%= localDir %>/css'
                ,
                    expand: true
                    cwd: '<%= srcDir %>/font'
                    src: ['**/*']
                    dest: '<%= localDir %>/font'
                ,
                    expand: true
                    cwd: '<%= srcDir %>/img'
                    src: ['**/*']
                    dest: '<%= localDir %>/img'
                ,
                    expand: true
                    src: ['bower.json', 'package.json']
                    dest: '<%= localDir %>'
                ]

            build:
                files: [
                    expand: true
                    cwd: '<%= srcDir %>/templates'
                    src: ['**/*']
                    dest: '<%= buildDir %>/js/templates'
                ,
                    expand: true
                    cwd: '<%= srcDir %>/js'
                    src: ['**/*']
                    dest: '<%= buildDir %>/js'
                ]

            dist:
                files: [
                    expand: true
                    cwd: '<%= srcDir %>/css'
                    src: ['**/*']
                    dest: '<%= distDir %>/css'
                ,
                    expand: true
                    cwd: '<%= srcDir %>/font'
                    src: ['**/*']
                    dest: '<%= distDir %>/font'
                ,
                    expand: true
                    cwd: '<%= srcDir %>/img'
                    src: ['**/*']
                    dest: '<%= distDir %>/img'
                ,
                    expand: true
                    src: ['bower.json', 'package.json']
                    dest: '<%= distDir %>'
                ]


        symlink:
            options:
                type: 'dir'

            templates:
                relativeSrc: '../../<%= srcDir %>/templates'
                dest: '<%= localDir %>/js/templates'


        requirejs:
            options:
                baseUrl: '.'
                inlineText: true
                preserveLicenseComments: false
                generateSourceMaps: true
                wrap: false
                logLevel: 1
                throwWhen:
                    optimize: true

                # RequireJS plugin configs
                config:
                    tpl:
                        variable: 'data'

                modules: [
                    name: pkg.name
                    exclude: [
                        'jquery'
                        'backbone'
                        'underscore'
                        'marionette'
                        'highcharts'
                        'bootstrap'
                        'json2'
                    ]
                ]

                # Post analysis of built files
                done: (done, output) ->
                    dups = require('rjs-build-analysis').duplicates(output)
                    if dups.length > 0
                        grunt.log.subhead 'Duplicates found in RequireJS build:'
                        grunt.log.warn dups
                        done new Error('r.js built duplicate modules, please check the `excludes` option.')
                    done()

            dist:
                options:
                    appDir: 'build/js'
                    dir: 'dist/js'
                    optimize: 'uglify2'
                    removeCombined: true
                    generateSourceMaps: false


        clean:
            local: ['local']
            build: ['build']
            dist: ['dist']
            postdist: [
                '<%= distDir %>/js/templates'
            ]
            release: [
                '<%= localDir %>/js/build.txt'
                '<%= localDir %>/js/**/**/**/**/*.map'
                '<%= localDir %>/css/**/*.map'
                '<%= distDir %>/js/build.txt'
            ]


        jasmine:
            options:
                specs: '<%= specDir %>/**/**/**/*.js'
                host: 'http://127.0.0.1:8126'
                helpers: './specConfig.js'
                keepRunner: true
                template: require('grunt-template-jasmine-requirejs')

            local:
                options:
                    templateOptions:
                        requireConfig:
                            baseUrl: '<%= localDir %>/js'
                            config:
                                tpl:
                                    variable: 'data'

            dist:
                options:
                    templateOptions:
                        requireConfig:
                            baseUrl: '<%= distDir %>/js'
                            config:
                                tpl:
                                    variable: 'data'


    grunt.loadNpmTasks 'grunt-contrib-jasmine'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-sass'
    grunt.loadNpmTasks 'grunt-contrib-requirejs'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-symlink'

    grunt.registerMultiTask 'serve', 'Run a Node server for testing', ->
        http = require('http')
        path = require('path')
        url = require('url')
        fs = require('fs')

        contentTypes =
            '.js': 'text/javascript'
            '.css': 'text/css'
            '.html': 'text/html'

        options = @options
            hostname: 'localhost'
            base: '.'
            port: 8125
            keepalive: false

        serveResponse = (filename, response) ->
            extname = path.extname(filename)
            contentType = contentTypes[extname] or 'text/plain'

            response.writeHead 200,
                'Content-Type': contentType

            stream = fs.createReadStream(filename)
            stream.pipe response

        serve404 = (filename, response) ->
            response.writeHead 404
            response.end()

        serve500 = (filename, response) ->
            response.writeHead 500
            response.end()

        server = http.createServer (request, response) ->
            uri = url.parse(request.url).pathname
            filename = path.join(options.base, uri)

            fs.exists filename, (exists) ->
                if exists
                    fs.readFile filename, (error, content) ->
                        if error
                            if error.code is 'EISDIR'
                                filename += 'index.html'
                                fs.exists filename, (exists) ->
                                    if exists
                                        fs.readFile filename, (error, content) ->
                                            if error
                                                serve500(filename, response)
                                            else
                                                serveResponse(filename, response)
                                    else
                                        serve404(filename, response)
                            else
                                serve500(filename, response)
                        else
                            serveResponse(filename, response)
                else
                    serve404(filename, response)

        if options.hostname is '*'
            options.hostname = null

        if options.port is '?'
            options.port = 0

        done = @async()

        server.listen(options.port, options.hostname)

            .on 'listening', ->
                address = server.address()
                hostname = server.hostname or 'localhost'
                if not options.keepalive
                    done()
                else
                    grunt.log.writeln "Listening on #{ hostname }:#{ address.port }..."

            .on 'error', (error) ->
                if error.code is 'EADDRINUSE'
                    grunt.fatal("Port #{ options.port } is already in use by another process.")
                else
                    grunt.fatal(error)


    grunt.registerTask 'local', 'Creates a build for local development and testing', [
        'sass:local'
        'coffee:local'
        'copy:local'
        'symlink'
        'jasmine:local:build'
    ]

    grunt.registerTask 'dist', 'Creates a build for distribution', [
        'clean:build'
        'coffee:build'
        'copy:build'
        'clean:dist'
        'requirejs:dist'
        'sass:dist'
        'copy:dist'
        'clean:postdist'
    ]

    grunt.registerTask 'work', 'Performs the initial local build and starts a watch process', [
        'local'
        'watch'
    ]

    grunt.registerTask 'test', 'Compiles local CoffeeScript files and uses Jasmine', [
        'coffee:local'
        'copy:local'
        'symlink'
        'serve:jasmine'
        'jasmine:local'
    ]

    changeVersion = (fname, version) ->
        contents = grunt.file.readJSON(fname)
        current = contents.version
        contents.version = version
        grunt.file.write(fname, JSON.stringify(contents, null, 2))
        grunt.log.ok "#{ fname }: #{ current } => #{ version }"

    replaceVersion = (fname, current, version) ->
        options = encoding: 'utf8'
        content = grunt.file.read(fname, options)

        regexp = new RegExp("version: '#{ current }'")
        if not regexp.test(content)
            grunt.fatal('File contents does not match version')
        content = content.replace(regexp, "version: '#{ version }'")

        grunt.file.write(fname, content, options)
        grunt.log.ok "#{ fname }: #{ current } => #{ version }"

    # Uses package.json as the canonical version
    grunt.registerTask 'bump-final', 'Updates the version to final', ->
        svutil = require('semver-utils')
        current = pkg.version
        version = svutil.parse(pkg.version)

        # Ensure it is able to be bumped
        if version.release isnt 'beta'
            grunt.fatal("Version #{ current } not beta. Is this ready for release?")

        # Remove release and build strings
        version.release = ''
        version.build = ''
        pkg.version = svutil.stringify(version)

        replaceVersion('src/js/cilantro/core.js', current, pkg.version)

        for fname in ['package.json', 'bower.json']
            changeVersion(fname, pkg.version)

    grunt.registerTask 'bump-patch', 'Updates the version to next patch-release', ->
        svutil = require('semver-utils')
        current = pkg.version
        version = svutil.parse(pkg.version)

        # Ensure it is able to be bumped
        console.log(version.release)
        if version.release
            grunt.fatal("Version #{ current } not final. Should this be bumped to a pre-release?")

        # Remove release and build strings
        version.patch = '' + (parseInt(version.patch, 10) + 1)
        version.release = 'beta'
        version.build = ''
        pkg.version = svutil.stringify(version)

        replaceVersion('src/js/cilantro/core.js', current, pkg.version)

        for fname in ['package.json', 'bower.json']
            changeVersion(fname, pkg.version)

        run 'git add bower.json package.json src/js/cilantro/core.js'
        run "git commit -s -m '#{ [version.major, version.minor, version.patch].join('.') } Bump'"

    grunt.registerTask 'tag-release', 'Create a release on master', ->
        run 'git add bower.json package.json src/js/cilantro/core.js'
        run "git commit -s -m '#{ pkg.version } Release'"
        run "git tag #{ pkg.version }"

    grunt.registerTask 'release-binaries', 'Create a release binary for upload', ->
        releaseDirName = "#{ pkg.name }-#{ pkg.version }"

        run "rm -rf #{ pkg.name }"
        run "mkdir -p #{ pkg.name }"
        run "cp -r dist/* #{ pkg.name }"
        run "zip -r #{ releaseDirName }.zip #{ pkg.name }"
        run "tar -Hzcf #{ releaseDirName }.tar.gz #{ pkg.name }"

        run "rm -rf #{ pkg.name }"
        run "mkdir -p #{ pkg.name }"
        run "cp -r local/* #{ pkg.name }"
        run "zip -r #{ releaseDirName }-src.zip #{ pkg.name }"
        run "tar -Hzcf #{ releaseDirName }-src.tar.gz #{ pkg.name }"

        run "rm -rf #{ pkg.name }"

    grunt.registerTask 'release-help', 'Prints the post-release steps', ->
        grunt.log.ok 'Push the code and tags: git push && git push --tags'
        grunt.log.ok "Go to #{ pkg.homepage }/releases to update the release descriptions and upload the binaries"

    grunt.registerTask 'release', 'Builds the distribution files, creates the release binaries, and creates a Git tag', [
        'bump-final'
        'local'
        'dist'
        'clean:release'
        'release-binaries'
        'tag-release'
        'release-help'
        'bump-patch'
    ]
