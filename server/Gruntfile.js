module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-ember-templates');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),



        // for changes to the node code
        nodemon: {
            dev: {
                options: {
                    file: 'server-dev.js',
                    nodeArgs: ['--debug'],
                    watchedFolders: ['app'],
                    env: {
                        PORT: '3300'
                    }
                }
            }
        },

        // server tests
        // simplemocha: {
        //     options: {
        //         globals: ['expect', 'sinon'],
        //         timeout: 3000,
        //         ignoreLeaks: false,
        //         ui: 'bdd',
        //         reporter: 'spec'
        //     },

        //     server: {
        //         src: ['spec/spechelper.js', 'spec/**/*.test.js']
        //     }
        // },

        // mongod server launcher
        shell: {
            mongo: {
                command: 'mongod',
                options: {
                    async: true
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'shell:mongo'],
                options: {
                    logConcurrentOutput: true
                }
            }
            // test: {
            //     tasks: ['watch:karma'],
            //     options: {
            //         logConcurrentOutput: true
            //     }
            // }
        },

        // for front-end tdd
        // karma: {
        //     options: {
        //         configFile: 'karma.conf.js'
        //     },
        //     watcher: {
        //         background: true,
        //         singleRun: false
        //     },
        //     test: {
        //         singleRun: true
        //     }
        // },
    });

    grunt.registerTask('server', ['concurrent:dev']);
    grunt.registerTask('test:server', ['simplemocha:server']);

    grunt.registerTask('test:client', ['karma:test']);
    grunt.registerTask('tdd', ['karma:watcher:start', 'concurrent:test']);

    grunt.registerTask('test', ['test:server', 'test:client']);
};
