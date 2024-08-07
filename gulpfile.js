import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import notify from 'gulp-notify';
import browser from 'browser-sync';

import htmlmin from 'gulp-htmlmin';
import rename from 'gulp-rename';

import cache from 'gulp-cache';
import changed from 'gulp-change';

import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import gcssmq from 'gulp-group-css-media-queries';

import terser from 'gulp-terser';
import concat from 'gulp-concat';

import sharp from 'gulp-sharp-responsive';

import { stacksvg } from 'gulp-stacksvg';

import delet from 'del';


import imagemin, {
  mozjpeg,
  optipng,
  svgo
} from 'gulp-imagemin';


import bemlinter from 'gulp-html-bemlinter';


// Sass to css

export function scssToCss() { //переводит синтаксис SASS в стандартный CSS;
  return gulp.src('source/sass/style.scss', { sourcemaps: true }) //обращается к исходному файлу style.scss;
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError)) //показывает в терминале информацию о наличии ошибок в исходном файле;

    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream())
    .pipe(notify('scss ===> css'));
}

// Server

export function server(done) {
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

export function reload(done) {
  browser.reload();
  done();
}

// Watcher

export function watcher() {
  gulp.watch('source/sass/**/*.scss', gulp.series(scssToCss, cssMinif));
  gulp.watch('source/*.html', gulp.series(htmlMinif, reload));

  gulp.watch('source/js/*.js', gulp.series(jsMinif));
  // gulp.watch(`source/icons/**/*.svg`, series(createStack, reloadServer));
}

export default gulp.series(scssToCss, server, watcher);

// =============== минимизация ============

// html-MIN

export function htmlMinif() {
  return gulp.src('source/*.html')
    .pipe(plumber())
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(notify('MinHtml'))
    .pipe(gulp.dest('build'));
}


// css-MIN

export function cssMinif() {
  return gulp.src('source/css/*.css', { sourcemaps: true })
    .pipe(plumber())  //Надо?
    .pipe(gcssmq()) // группирует вместе все медиавыражения и размещает их в конце файла;
    // важен порядок ! gcssmq до postcss
    .pipe(postcss([
      autoprefixer(), //добавляет вендорные префиксы CSS
      csso()
    ]))
    .pipe(rename('style-min.css'))

    // .pipe(rename({
    //  basename: 'style',
    //  suffix: '-min'
    // }))

    .pipe(notify('MinCss'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))  //сохраняет итоговый файл в папку /build/css/
}


// jsMin

export function jsMinif() {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(concat('index.js')) // Конкатенируем в один файл

    .pipe(rename({
      suffix: '-min'
    }))

    .pipe(notify('MinJs'))
    .pipe(gulp.dest('build/js'))
}

export const minif = gulp.parallel(htmlMinif, cssMinif, jsMinif);



// =============== отпимизация изображений ============

// Images

// оптимизация jpg, png, svg

export function imgOpt() {
  // return gulp.src('source/**/*.{png,jpg,svg}')
  return gulp.src('source/img/img_test/**/*.{png,jpg,svg}')

    .pipe(cache(imagemin([
      mozjpeg({ //для jpg

        quality: 75, //Качество сжатия в диапазоне от 0 (наихудшее) до 100 (идеальное).
        progressive: true  //прогрессивность, false создает базовый файл JPEG
      }),

      optipng({
        optimizationLevel: 3//уровень оптимизации от 0 до 7.
      }
      ),

      svgo({
        plugins: [{
          name: 'cleanupIDs',
          active: false
        }, {
          name: 'preset-default', // предустановленные настройки по умолчанию
          params: {
            overrides: {
              // настройка параметров:
              convertPathData: {
                floatPrecision: 2,
                forceAbsolutePath: false,
                utilizeAbsolute: false,
              },
              // отключить плагин
              removeViewBox: false,
            },
          },
        }]
      })
    ])))
    .pipe(notify('imgOpt'))
    .pipe(gulp.dest('build/'));
}

// ретинизация + webp +webp@2x

export function retinaWebp() {
  return gulp.src('build/**/*.{png,jpg}')
    .pipe(changed('build/**/*.{png,jpg}', { extension: '.webp' }))
    .pipe(sharp({
      includeOriginalFile: true,
      formats: [{
        width: (metadata) => metadata.width * 2,
        rename: {
          suffix: "@2x"
        },
        jpegOptions: {
          progressive: true
        },
      }, {
        width: (metadata) => metadata.width * 2,
        format: "webp",
        rename: {
          suffix: "@2x"
        }
      }, {
        format: "webp"
      },]
    }))
    .pipe(gulp.dest('build/opt_2x'))

    .pipe(notify('оптимизация!'))
}

export function createStack() {
  return gulp.src('build/icons/*.svg')

    .pipe(stacksvg())

    .pipe(notify('стек!'))

    .pipe(gulp.dest('build/stek'));
}

export const optim = gulp.series(imgOpt, createStack, retinaWebp);

// Линты
// Линты из требований Д19 и Д20 в package.json, проверка валидации там же
export function lintBem() {
  return gulp.src('source/**/*.html')
    .pipe(bemlinter());
}

// конечная сборка. BUILD

// del

export const clean = () => {
  return delet('build');
};

// copy - копирую в BUILD всё, что не изменяетя (шрифты, фавиконки)

export function copy() {
  return gulp.src(['source/fonts/**/*.{woff2,woff}',
    'source/*.ico',
  ], {
    base: 'source'
  }
  )
    .pipe(notify('копируем шрифты'))

    .pipe(gulp.dest('build'))

}


// Build

export const build = gulp.series(
  clean,
  copy,
  minif
)
