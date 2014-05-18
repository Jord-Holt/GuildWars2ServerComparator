module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//gitpull: {},
		copy: {
			main: {
				src: 'scripts/*',
				dest: 'Test/'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-git');

	grunt.registerTask('default', ['copy']);
};