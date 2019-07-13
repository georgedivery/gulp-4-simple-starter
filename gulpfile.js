/**
 * A simple Gulp 4 Starter Kit oriented to css modules
 * 
 * @author georgedivery
 * @copyright 2019 georgedivery
 * @license https://help.github.com/en/articles/licensing-a-repository
 * @version v0.0.3
 * @link https://github.com/georgedivery/gulp-4-simple-starter.git 
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */

const   gulp                      = require('gulp'),
		del                       = require('del'),
		sourcemaps                = require('gulp-sourcemaps'),
		plumber                   = require('gulp-plumber'),
		order                     = require("gulp-order"), 
		autoprefixer              = require('gulp-autoprefixer'),
		minifyCss                 = require('gulp-clean-css'),
		uglify                    = require('gulp-uglify'),
		concat                    = require('gulp-concat'),
		ssi                       = require("gulp-ssi"),
		imagemin                  = require('gulp-imagemin'),
		browserSync               = require('browser-sync').create(),

		src_folder                = './src/',
		src_assets_folder         = src_folder + 'assets/',
		dist_folder               = './dist/',
		dist_assets_folder        = dist_folder + 'assets/',
		node_modules_folder       = './node_modules/',
		dist_node_modules_folder  = dist_folder + 'node_modules/',

		node_dependencies         = Object.keys(require('./package.json').dependencies || {});

gulp.task('clear', () => del([ dist_folder ]));

gulp.task('html', () => {  

	return gulp.src([ 
			src_folder + '**/*.html',
			'!'+ src_folder + 'ssi/**'
	])

	 .pipe(ssi({
				root: './src/'
		}))
		.pipe(gulp.dest(dist_folder))
		.pipe(browserSync.stream());
}); 

gulp.task('css', () => {
	return gulp.src([src_assets_folder + 'css/**/*.css', ] )
		.pipe(order([  
				"css/global/*.css", 
				"css/region/*.css", 
				"css/modules/*.css",
			]))
		.pipe(concat("style.css"))
		.pipe(autoprefixer())
		.pipe(gulp.dest(dist_assets_folder + 'css'))
		.pipe(browserSync.stream());
});

gulp.task('vendor', () => {
	return gulp.src([src_assets_folder + 'vendor/**/*.*', ] )
		.pipe(gulp.dest(dist_assets_folder + 'vendor'))
		.pipe(browserSync.stream());
});

gulp.task('js', () => {
	return gulp.src([ src_assets_folder + 'js/**/*.js' ] ) 
		.pipe(gulp.dest(dist_assets_folder + 'js'))
		.pipe(browserSync.stream());
});

gulp.task('images', () => {
	return gulp.src([ src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)' ], { since: gulp.lastRun('images') })
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest(dist_assets_folder + 'images'))
		.pipe(browserSync.stream());
}); 

gulp.task('build', gulp.series('clear', 'html', 'vendor', 'css', 'js', 'images'));

gulp.task('dev', gulp.series('html', 'vendor', 'css', 'js'));

gulp.task('serve', () => {
	return browserSync.init({
		server: {
			baseDir: [ 'dist' ],
			directory: true
		},
		port: 3000,
		open: true
	});
});

gulp.task('watch', () => {
	const watchImages = [
		src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)'
	]; 
	const watch = [
		src_folder + '**/*.html',
		src_assets_folder + 'css/**/*.css', 
		src_assets_folder + 'js/**/*.js'
	];

	gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
	gulp.watch(watchImages, gulp.series('images')).on('change', browserSync.reload); 
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
