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
        dest: 'game/scripts/gamecore.js'
      },

      playcraft: {
        src:  PATHS.playcraft.map(function(path){return 'vendors/playcraftengine/playcraftjs/lib/'+path}),
        dest: 'game/scripts/playcraft.js'
      },
      
      game: {
        src:  ['lib/game.js','lib/**/*.js'],
        dest: 'game/scripts/game.js'
      }
    },

    watch: {
      game: {
        files: 'lib/**/*.js',
        tasks: ['concat_sourcemap:game']
      }
    },

    symlink: {
      assets: {
        src: './assets',
        dest: './game/assets'
      }
    },

    connect: {
      server: {
        options:{
          port:8282,
          base: 'game'
        }
      }
    }

  });

  grunt.registerTask('install', ['concat_sourcemap', 'symlink']);
  grunt.registerTask('run', ['connect:server','watch:game']);

  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-connect');
};