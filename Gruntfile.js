module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		gitclone: {
			clone : {
				options: {
					repository : 'https://github.com/Xfanger/GuildWars2ServerComparator.git',
					directory : 'Build/'
				}
			}
		},
		copy: {
			main: {
				src: 'Build/*',
				dest: '../parse/public/'
			}
		},
		clean : ["Build/*"]
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-git');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['clean','gitclone','copy']);
};