module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['spec/*.js',
            'featured.js']
    }
  });
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', 'jasmine_node');
};