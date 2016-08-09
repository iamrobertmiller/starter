var     gulp = require('gulp'),
		gutil = require('gulp-util'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant'),
		util = require('gulp-util'),
		notify = require('gulp-notify'),
		plumber = require('gulp-plumber'),
		jshint = require('gulp-jshint'),
		sourcemaps = require('gulp-sourcemaps'),
		sass = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		stripCssComments = require('gulp-strip-css-comments'),
		minifyCss = require('gulp-minify-css'),
		concat = require('gulp-concat'),
		stripDebug = require('gulp-strip-debug'),
		uglify = require('gulp-uglify'),
		newer = require('gulp-newer'),
		filter = require('gulp-filter'),
		del = require('del'),
		watch = require('gulp-watch'),
		runSequence = require('run-sequence'),
		argv = require('yargs').argv,
		gulpif = require('gulp-if'),
		browserSync = require('browser-sync').create();

var     srcRoot = './src/',
		distRoot = './dist/',

		srcThemeDir = srcRoot,
		distThemeDir = distRoot,
		//distThemeDir = distRoot+'wp-content/themes/etc/',

		themeMainJs = srcThemeDir+'js/main.js',
		themeJsFiles = [
			srcThemeDir+'js/libs/**/*.js',
			themeMainJs
		],

		_vendorJs = 'js/vendor/**/*.js',

		srcThemeVendorJs = srcThemeDir+_vendorJs,
		distThemeVendorJs = distThemeDir+_vendorJs,

		themeMainSassFiles = srcThemeDir+'scss/style.scss',
		themeSassFiles = srcThemeDir+'scss/**/*.scss',

		_imageFiles = 'images/**/*',

		srcThemeImageFiles = srcThemeDir+_imageFiles,
		distThemeImageFiles = distThemeDir+_imageFiles,

		_templateFiles = '**/*.{php,html}',

		srcThemeTemplateFiles = srcThemeDir+_templateFiles,
		distThemeTemplateFiles = distThemeDir+_templateFiles,

		_fontFiles = 'fonts/**/*',

		srcThemeFontFiles = srcThemeDir+_fontFiles,
		distThemeFontFiles = distThemeDir+_fontFiles,

		srcThemeFiles = [srcThemeTemplateFiles, srcThemeDir+'style.css', srcThemeDir+'screenshot.png'],
		distThemeFiles = [distThemeTemplateFiles, distThemeDir+'style.css', distThemeDir+'screenshot.png'],

		plumberErrorHandler = {
			errorHandler: notify.onError({
				title: 'Gulp',
				message: 'Plugin: <%= error.plugin %> \nError: <%= error.message %>'
			})
		};


gulp.task('clean-theme-files', function(cb) {
	del([distThemeFiles, '!dist'], cb);
});

gulp.task('clean-theme-css', function(cb) {
	del([distThemeDir+'css/**', '!'+distThemeDir+'css'], cb);
});

gulp.task('clean-theme-scripts', function(cb) {
	del([distThemeDir+'js/**', '!'+distThemeDir+'js'], cb);
});

gulp.task('clean-theme-images', function(cb) {
	del([distThemeDir+'images/**', '!'+distThemeDir+'images'], cb);
});

gulp.task('clean-theme-fonts', function(cb) {
	del([distThemeDir+'fonts/**', '!'+distThemeDir+'fonts'], cb);
});


gulp.task('clean', function(){
	runSequence('clean-theme-css', 'clean-theme-scripts', 'clean-theme-images', 'clean-theme-fonts', 'clean-theme-files');
});


gulp.task('theme-files', function() {
	return gulp.src(srcThemeFiles)
			.pipe(plumber(plumberErrorHandler))
			.pipe(gulp.dest(distThemeDir))
			.pipe(browserSync.stream());

});


gulp.task('theme-images', function() {
	return gulp.src(srcThemeImageFiles)
			.pipe(plumber(plumberErrorHandler))
			.pipe(newer(distThemeImageFiles))
			.pipe(imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()]
			}))
			.pipe(gulp.dest(distThemeDir+'images'))
			.pipe(browserSync.stream());
});

gulp.task('theme-fonts', function() {
	return gulp.src(srcThemeFontFiles)
			.pipe(plumber(plumberErrorHandler))
			.pipe(gulp.dest(distThemeDir+'fonts'))
			.pipe(browserSync.stream());
});


gulp.task('theme-sass', function() {
	return gulp.src(themeMainSassFiles)
			.pipe(plumber(plumberErrorHandler))
				.pipe(gulpif(argv.dev, sourcemaps.init()))
			.pipe(sass())
			.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}))
				.pipe(gulpif(argv.dev, sourcemaps.write('.')))
			.pipe(gulp.dest(distThemeDir+'css'))
				.pipe(gulpif(!argv.dev, plumber.stop()))
				.pipe(gulpif(!argv.dev, filter(distThemeDir+'css/*.css')))
				.pipe(gulpif(!argv.dev, stripCssComments()))
				.pipe(gulpif(!argv.dev, minifyCss()))
			.pipe(browserSync.stream());

});


gulp.task('theme-lint', function() {
	gulp.src(themeMainJs)
			.pipe(plumber(plumberErrorHandler))
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('theme-scripts', function() {
	return gulp.src(themeJsFiles, { base: '.' })
			.pipe(plumber(plumberErrorHandler))
				.pipe(gulpif(argv.dev, sourcemaps.init()))
			.pipe(concat('main.js'))
				.pipe(gulpif(argv.dev, sourcemaps.write('.')))
				.pipe(gulpif(!argv.dev, stripDebug()))
				.pipe(gulpif(!argv.dev, uglify()))
			.pipe(gulp.dest(distThemeDir+'js'))
			.pipe(browserSync.stream());
});


gulp.task('theme-vendor-scripts', function() {
	return gulp.src(srcThemeVendorJs)
			.pipe(plumber(plumberErrorHandler))
			.pipe(newer(distThemeVendorJs))
			.pipe(gulp.dest(distThemeDir+'js/vendor'))
			.pipe(browserSync.stream());
});


gulp.task('serve', ['clean'], function() {

	gulp.start('watch');

	browserSync.init({
		server: "./dist"
	});

});


gulp.task('watch', function() {

	gulp.start('default');

	gulp.src(srcThemeTemplateFiles)
			.pipe(watch(srcThemeTemplateFiles, function() {
				runSequence('theme-files');
			}));

	gulp.src(srcThemeFontFiles)
			.pipe(watch(srcThemeFontFiles, function() {
				gulp.start('theme-fonts');
			}));

	gulp.src(srcThemeVendorJs)
			.pipe(watch(srcThemeVendorJs, function() {
				gulp.start('theme-vendor-scripts');
			}));


	gulp.src(themeJsFiles)
			.pipe(watch(themeJsFiles, function() {
				runSequence('theme-lint', 'theme-scripts');
			}));

	gulp.src(themeSassFiles)
			.pipe(watch(themeSassFiles, function() {
				gulp.start('theme-sass');
			}));

	gulp.src(srcThemeImageFiles)
			.pipe(watch(srcThemeImageFiles, function() {
				gulp.start('theme-images');
			}));

});

// Default Task
gulp.task('default', function(){
	runSequence('clean', [
		'theme-sass',
		'theme-lint'
	], [
		'theme-scripts',
		'theme-vendor-scripts',
		'theme-images'
	], 'theme-files', 'theme-fonts');
});
