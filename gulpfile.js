const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');
const jshint = require('gulp-jshint');

const files = [
    'build/js/utils/**/*.js',
    'build/js/vendor/**/*.js',
    'build/js/**/*.js'
];

gulp.task('es5', () => {

    gulp.src(files)
        .pipe(jshint())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('v360.js'))
        .pipe(minify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/es5'));

});

gulp.task('es6', () => {

    gulp.src(files)
        .pipe(jshint())
        .pipe(sourcemaps.init())
        .pipe(concat('v360.js'))
        .pipe(minify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/es6'));

});

gulp.task('default', ['es5', 'es6', 'watch']);

gulp.task('watch', () =>
    gulp.watch('build/js/**/*.js', ['es5', 'es6']));