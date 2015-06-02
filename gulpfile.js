var gulp = require('gulp');
var clean = require('gulp-clean');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');

/**
 * File patterns
 **/

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');
var cordovaTest = {
	libPath: './cordova-test/www/lib',
	libs: [
		{
			lib: 'angular',
			src: [
				'./bower_components/angular/angular.js',
				'./bower_components/angular-touch/angular-touch.js',
				'./bower_components/angular-animate/angular-animate.js',
				'./bower_components/angular-aria/angular-aria.js',
				'./bower_components/angular-route/angular-route.js'
			]
		},
		'./dist/phonegular.js',
		'./bower_components/hammerjs/hammer.js',
		{
			lib: 'angular-material',
			src: [
				'./bower_components/angular-material/angular-material.js',
				'./bower_components/angular-material/angular-material.css'
			]
		}
	]
};

var sourceFiles = [

	// Make sure module files are handled first
	path.join(sourceDirectory, '/**/*.module.js'),

	// Then add all JavaScript files
	path.join(sourceDirectory, '/**/*.js')
];

var lintFiles = [
	'gulpfile.js',
	// Karma configuration
	'karma-*.conf.js'
].concat(sourceFiles);

gulp.task('build', function () {
	gulp.src(sourceFiles)
		.pipe(plumber())
		.pipe(concat('phonegular.js'))
		.pipe(gulp.dest('./dist/'))
		.pipe(uglify())
		.pipe(rename('phonegular.min.js'))
		.pipe(gulp.dest('./dist'));

	runSequence('prepare-cordova-test');
});

gulp.task('prepare-cordova-test', function () {
	gulp.src('./[object Object],.', {read: false}).pipe(clean());

	cordovaTest.libs.forEach(function(libData) {
		switch (typeof libData) {
			case 'string':
				gulp.src(libData)
					.pipe(gulp.dest(cordovaTest.libPath));

				break;

			case 'object':
				gulp.src(libData.src)
					.pipe(gulp.dest(cordovaTest.libPath + '/' + libData.lib));

				break;

			default:
				throw 'Unknown library format.';
		}
	});
});

/**
 * Process
 */
gulp.task('process-all', function (done) {
	runSequence('jshint', 'test-src', 'build', done);
});

/**
 * Watch task
 */
gulp.task('watch', function () {

	// Watch JavaScript files
	gulp.watch(sourceFiles, ['process-all']);
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
	return gulp.src(lintFiles)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function (done) {
	karma.start({
		configFile: __dirname + '/karma-src.conf.js',
		singleRun: true
	}, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
	karma.start({
		configFile: __dirname + '/karma-dist-concatenated.conf.js',
		singleRun: true
	}, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
	karma.start({
		configFile: __dirname + '/karma-dist-minified.conf.js',
		singleRun: true
	}, done);
});

gulp.task('default', function () {
	runSequence('process-all', 'watch');
});
