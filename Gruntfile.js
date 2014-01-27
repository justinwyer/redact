module.exports = function (grunt) {
  grunt.initConfig({
    jasmine_node: {
      coverage: {
        excludes: ['spec/**']
      }
    },
    jshint: {
      all: ['spec/*.js', 'featured.js']
    },
    watch: {
      jasmine_node: {
        files: ['redact.js', 'spec/**/*.js'],
        tasks: ['jasmine_node'],
        options: {
          livereload: true
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node-coverage');
  grunt.registerTask('default', 'jasmine_node');
};