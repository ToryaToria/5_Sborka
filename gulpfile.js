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
import gcssmq from 'gulp-group-css-media-queries';

import terser from 'gulp-terser';
// import concat from 'gulp-concat';

// import squoosh from 'gulp-libsquoosh';




// Styles

export const scssToCss = () => { //переводит синтаксис SASS в стандартный CSS;
  return gulp.src('source/sass/style.scss', { sourcemaps: true }) //обращается к исходному файлу style.scss;
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError)) //показывает в терминале информацию о наличии ошибок в исходном файле;

    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream())
    .pipe(notify('scss ===> css'));
}

// Server

const server = (done) => {
  browser.init({ //инициализируем веб-сервер;
    server: {
      baseDir: 'source', // указываем рабочую папку;
      serveStaticOptions: { // упрощаем ввод в браузере адреса страницы — без расширения .html;
        extensions: ['html'],
      },
    },
    cors: true,
    notify: false,
    ui: false, //назначаем номер порта для пользовательского интерфейса веб-сервера;
    open: true, //открываем в браузере главную страницу сайта.
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

// =============== минимизация ============

// html-MIN

export const htmlMinif = () => {
  return gulp.src('source/*.html')
    .pipe(plumber())
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(notify('MinHtml'))
    .pipe(gulp.dest('tmp'));
}


// css-MIN

export const cssMinif = () => {
  return gulp.src('source/css/*.css', { sourcemaps: true })
    .pipe(plumber())  //Надо?
    .pipe(gcssmq()) // группирует вместе все медиавыражения и размещает их в конце файла;
    // важен порядок ! gcssmq до postcss
    .pipe(postcss([
      autoprefixer(), //добавляет вендорные префиксы CSS
      csso()
    ]))
    // .pipe(rename('style.min.css'))
    .pipe(notify('MinCss'))
    .pipe(gulp.dest('tmp/css', { sourcemaps: '.' }))  //сохраняет итоговый файл в папку /tmp/css/
}


// jsMinif

export const jsMinif = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    // .pipe(concat('index.js')) // Конкатенируем в один файл
    .pipe(notify('MinJs'))
    .pipe(gulp.dest('tmp/js'))
  }

  export const minif = gulp.series(htmlMinif, cssMinif, jsMinif);



// =============== отпимизация изображений ============

// Images

// export const optimizeImages = () => {
//   return gulp.src('source/img/**/*.{png,jpg}')
//     // .pipe(squoosh())
//     .pipe(notify('Optim_png&jpg'))

//     .pipe(gulp.dest('tmp/img'))
// }
