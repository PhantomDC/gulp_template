		var gulp     = require('gulp'),
		sass         = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify'),
		babel        = require('gulp-babel'),
		sourcemaps   = require('gulp-sourcemaps'),
		minifyCSS 	 = require('gulp-minify-css'),
		tinypng      = require('gulp-tinypng-compress'),
		clean        = require("gulp-clean"),
		notify       = require("gulp-notify"),
		pug          = require("gulp-pug"),
		ftp         = require("gulp-ftp"),
		clip         = require("gulp-clip-empty-files"),
		zip         = require("gulp-zip");

		// FTP config

		const conf = {
			host: 'goldditp.bget.ru',
			user: 'goldditp_artem',
			pass: 'k]b97*MZ',
			remotePath : 'test/'
		}

		// Date

		var d = new Date();
		var date = `${d.getDate()}.0${d.getMonth() + 1}.${d.getFullYear()}`;

		gulp.task('browser-sync', ['styles','img','pug','scripts','other'], function() {
			browserSync.init({
				server: {
					baseDir: "./dist"
				},
				port: 8080,
				notify: false
			});
		});

		// Style: Compile .sass file add prefix and save in dist directory 

		gulp.task('styles', function () {
			return gulp.src('src/sass/*.sass')
			.pipe(sass().on('error', sass.logError))
			.pipe(concat('style.css'))
			.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'ios 7', 'android 4'))
			.pipe(gulp.dest('dist/css'))
		});

		// Img: Optimize images, remove from src and save in dist directory

		gulp.task('img', function () {
			return gulp.src('src/img/**/*.{png,jpg,jpeg}')
			.pipe(tinypng({
				key: 'gbyEDJ_AmYHqBAkzh_4mayamwkpz74sf',
				log: true
			}))
			.pipe(clean())
			.pipe(gulp.dest('dist/img'))
			.pipe(notify({ message: 'Images task complete' }));
		});

		// Pug -> html: Compile pug files and save html files in dist directory

		gulp.task("pug",function(){
			return gulp.src("src/pug/**/*.pug")
			.pipe(pug({pretty:true}))
			.pipe(gulp.dest("dist/"))
			.pipe(notify({ message: 'Pug files converted' }));
		});

		// Libs: Concat libs .js files and save in temp directory

		gulp.task('scripts_lb', function() {
			return gulp.src('src/libs/*.js')
			.pipe(concat('libs.js'))
			.pipe(gulp.dest('src/temp/js/'));
		});

		// Custom.js: Concat custom .js files and save in temp directory

		gulp.task('scripts_custom', function() {
			return gulp.src('src/js/*.js')
			.pipe(babel({
				presets: ['es2015']
			}))
			.pipe(concat('script_c.js'))
			.pipe(gulp.dest('src/temp/js/'));
		});

		// Libs: run concat libs and custom scripts, remove all files from temp directory and save in dist directory

		gulp.task('scripts',['scripts_lb','scripts_custom'], function() {
			return gulp.src('src/temp/js/*.js')
			.pipe(concat('script.js'))
			.pipe(clean())
			.pipe(gulp.dest('dist/js/'));
		});

		// Build .js: Task styles + minify .css files and write map

		gulp.task('build-styles',function(){
			return gulp.src('src/sass/*.sass')
			.pipe(sourcemaps.init())
			.pipe(sass().on('error', sass.logError))
			.pipe(concat('style.css'))
			.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'ios 7', 'android 4'))
			.pipe(minifyCSS())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist/css'))
		});

		// Build .js: Task scripts + minify .js files and write map

		gulp.task('build-scripts',['scripts_lb','scripts_custom'],function(){
			return gulp.src('src/temp/js/*.js')
			.pipe(sourcemaps.init())
			.pipe(concat('script.js'))
			.pipe(uglify())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist/js/'));
		});

		// Build : run build-styles and build-scripts one command

		gulp.task('build',['build-styles','build-scripts','img'],function(){
			gulp.src("dist")
			.pipe(notify({ message: 'Build complite' }));
		});

		// Deploy : Uses conf above and deploy on server

		gulp.task('deploy',['build'],function(){
			return gulp.src('dist/**/*')
			.pipe(ftp(conf));
		});

		// Save other file: Moves files. Formats: pdf,php,json,woff,ttf,otf,svg,eot,woff2 and save in dist directory

		gulp.task('other',function(){
			return gulp.src('src/**/*.{pdf,php,json,woff,ttf,otf,svg,eot,woff2}')
			.pipe(clip())
			.pipe(gulp.dest('dist/'));
		});

		// Backup: Create archive from ./dist directory. Save in root with name backup_dd.mm.YYYY.zip 

		gulp.task('backup',function(){
			return gulp.src("dist/*")
			.pipe(zip("backup_"+date+".zip"))
			.pipe(gulp.dest("./"));
		});

		// Watchers

		gulp.task('watch', function () {
			gulp.watch('src/sass/*.sass', ['styles']);
			gulp.watch('src/img/**/*.{png,jpg,jpeg}',['img']);
			gulp.watch("dist/img/**/*.{png,jpg,jpeg}").on("change",browserSync.reload);
			gulp.watch('src/**/*.js', ['scripts']);
			gulp.watch('dist/**/*.js').on("change",browserSync.reload);;
			gulp.watch('src/pug/**/*.pug',['pug']);
			gulp.watch('dist/**/*.html').on("change",browserSync.reload);
			gulp.watch('src/fonts/**/*').on("change",browserSync.reload);

			gulp.watch(['src/fonts/**/*','src/**/*.{pdf,php,json}'],['other']);
			gulp.watch(['dist/fonts/**/*','dist/**/*.{pdf,php,json}']).on("change",browserSync.reload);
		});

		gulp.task('default', ['browser-sync', 'watch']);
