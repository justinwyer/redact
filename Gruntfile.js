module.exports = function(grunt) {
  grunt.initConfig({
    jasmine_node: {
      coverage: {
        excludes: ['spec/**']
      }
    },
    jshint: {
      all: ['spec/*.js',
            'featured.js']
    }
  });
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node-coverage');
  grunt.registerTask('default', 'jasmine_node');
};