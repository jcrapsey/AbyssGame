module.exports = function(grunt) {
  var fs = require('fs');
  var PATHS = require('./paths.json');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat_sourcemap: {
      options: {
        sourcesContent: true
      },

      gamecore: {
        src:  PATHS.gamecore.map(function(path){return 'vendors/gamecore.js/src/'+path}),
        dest: 'www-root/scripts/gamecore.js'
      },

      playcraft: {
        src:  PATHS.playcraft.map(function(path){return 'vendors/playcraftengine/playcraftjs/lib/'+path}),
        dest: 'www-root/scripts/playcraft.js'
      },
      
      game: {
        src:  ['src/game/game.js','src/**/*.js'],
        dest: 'www-root/scripts/game.js'
      }
    },

    watch: {
      game: {
        files: 'src/**/*.js',
        tasks: ['concat_sourcemap:game']
      },

      html: {
        files: 'src/**/*.html',
        tasks: ['copy:html']
      }
    },

    symlink: {
      assets: {
        src: './assets',
        dest: './www-root/assets'
      }
    },

    connect: {
      server: {
        options:{
          port:8282,
          base: 'www-root'
        }
      }
    },

    copy: {
      html: {
        files: [
          {
            expand: true,
            cwd: './src/',
            src: ['**/*.html'],
            dest: './www-root/',
            filter: 'isFile'
          }
        ]
      }
    }

  });

  grunt.registerTask('install', ['concat_sourcemap', 'symlink']);
  grunt.registerTask('run', ['connect:server','watch:game']);

  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
};