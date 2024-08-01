import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import notify from 'gulp-notify';
import browser from 'browser-sync';

import htmlmin from 'gulp-htmlmin';
//  import htmlmin from 'html-minifier';

import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';



// Styles

export const scssToCss = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))

    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream())
    .pipe(notify('scss ===> css'));
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(scssToCss));
  // gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(reload));
  // gulp.watch(`source/icons/**/*.svg`, series(createStack, reloadServer));
}

export default gulp.series(scssToCss, server, watcher);

// минимизация

// html-MIN


export const htmlMinif = () => {
  return gulp.src('source/*.html')
    .pipe(plumber())
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('tmp'));
}


// css-MIN

export const cssMinif = () => {
  return gulp.src('source/css/*.css', { sourcemaps: true })
    .pipe(plumber())  //Надо?
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    // .pipe(rename('style.min.css'))
    .pipe(gulp.dest('tmp/css', { sourcemaps: '.' }))
}

// jsMinif

// export const jsMinif = () => {
//   return gulp.src('source/js/*.js')

//   .pipe(gulp.dest('tmp/js'))
//   }
