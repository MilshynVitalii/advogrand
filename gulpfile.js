const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
const less = require('gulp-less');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');
const smartGrid = require('smart-grid');
const path = require('path');
const critical = require('critical');
const webp = require('gulp-webp');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const fs = require('fs');

let isMap = process.argv.includes('--map');
let isMinify = process.argv.includes('--clean');
let isSync = process.argv.includes('--sync');

function criticalCss(done) {
	return critical.generate({
		base: './build/',
		src: 'index.html',
		css: ['css/main.css'],
		width: 1280,
  		height: 800,
		target: {
			css: 'css/critical.css',
			uncritical: 'css/async.css',
		},
		ignore: {
			atrule: ['@font-face'],
			rule: [/.modal/]
		}
	});
}

function clean(){
	return del('./build/*');
}

function html(){
	return gulp.src('./src/**/*.html')
			   .pipe(htmlmin({collapseWhitespace: true}))
			   .pipe(gulp.dest('./build'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function styles(){
	return gulp.src('./src/less/main.less')
			   .pipe(gulpIf(isMap, sourcemaps.init()))
			   .pipe(less())
			   .pipe(autoprefixer())
			   .pipe(gcmq())
			   .pipe(gulpIf(isMinify, cleanCSS({
			   		level: 2
			   })))
			   .pipe(gulpIf(isMap, sourcemaps.write()))
			   .pipe(gulp.dest('./build/css'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function replaceCode(){
	return gulp.src('./build/*.html')
				.pipe(replace('<link rel="stylesheet" type="text/css" href="./css/main.css">', function() {
					const style = fs.readFileSync('./build/css/critical.css', 'utf8');
					return '<style>\n' + style + '\n</style>';
				}))
				.pipe(replace('<!--asyncCss-->', function() {
					return `<script>function loadStyle(url){let link = document.createElement('link');link.href = url;link.rel = 'stylesheet';document.body.appendChild(link);}loadStyle('css/main.css');</script>`;
				}))
			   .pipe(gulp.dest('./build'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function images(){
	return gulp.src('./src/images/**/*')
			   .pipe(imagemin())
			   .pipe(gulp.dest('./build/images'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function webpImages() {
	return gulp.src('src/images/**/*')
			   .pipe(webp())
			   .pipe(gulp.dest('build/images'))
			   .pipe(gulpIf(isSync, browserSync.stream()));	
}

function fonts(){
	return gulp.src('./src/fonts/**/*')
			   .pipe(gulp.dest('./build/fonts'));
}

function scripts(){
	return gulp.src(['./src/js/libs/jquery-3.6.0.min.js',
					 './src/js/libs/jquery.inputmask.min.js',
					'./src/js/libs/jquery.validate.min.js',
					'./src/js/libs/slick.min.js',
					'./src/js/main.js'])
				.pipe(concat('main.js'))
			   .pipe(minify())
			   .pipe(gulp.dest('./build/js'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function watch(){
	if(isSync){
		browserSync.init({
	        server: {
	            baseDir: "./build/"
	        }
	    });
		gulp.watch('./src/less/**/*.less', styles);
		gulp.watch('./src/**/*.html', html);
		gulp.watch('./src/images/**/*', images);
		gulp.watch('./src/js/**/*', scripts);
		gulp.watch('./smartgrid.js', grid);
	}
}

function grid(done){
	delete require.cache[path.resolve('./smartgrid.js')];
	let options = require('./smartgrid.js');
	smartGrid('./src/less', options);
	done();
}

let build = gulp.series(clean, gulp.parallel(html, styles, images, webpImages, scripts, fonts), criticalCss, replaceCode);
let dev = gulp.series(build, watch);

gulp.task('build', build);
gulp.task('watch', dev);
gulp.task('grid', grid);
gulp.task('js', scripts);
gulp.task('critical', criticalCss);