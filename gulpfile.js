import gulp  from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
// import csso from 'postcss-csso';

const { src, dest, watch, series, parallel } = gulp;
// const sass = gulpSass(dartSass);

const PATH_TO_SOURCE = './source/';
const PATH_TO_DIST = './build/';
// const PATH_TO_RAW = './raw/';

// const PATHS_TO_STATIC = [
//   `${PATH_TO_SOURCE}fonts/**/*.{woff2,woff}`,
//   `${PATH_TO_SOURCE}*.ico`,
//   `${PATH_TO_SOURCE}*.webmanifest`,
//   `${PATH_TO_SOURCE}favicons/**/*.{png,svg}`,
//   `${PATH_TO_SOURCE}vendor/**/*`,
//   `${PATH_TO_SOURCE}images/**/*`,
//   `!${PATH_TO_SOURCE}**/README.md`,
// ];

let isDevelopment = true;



// Styles

export const styles = () => {
  return src(`${PATH_TO_SOURCE}styles/*.scss`, { sourcemaps: isDevelopment })
	.pipe(plumber())
	.pipe(sass().on('error', sass.logError))
	
	.pipe(postcss([
	autoprefixer()
	// csso()
	]))

	.pipe(rename('style.min.css'))
	.pipe(gulp.dest('build/css', { sourcemaps: '.' })) // почему не в sources?
	.pipe(browser.stream()); // в #19 здесь  .pipe(server.stream())  ?

	}

   // из #19, разберем?

		// .pipe(postcss([
    //   postUrl([
    //     {
    //       filter: '**/*',
    //       assetsPath: '../',
    //     },
    //     {
    //       filter: '**/icons/**/*.svg',
    //       url: (asset) => asset.url.replace(
    //         /icons\/(.+?)\.svg$/,
    //         (match, p1) => `icons/stack.svg#${p1.replace(/\//g, '_')}`
    //       ),
    //       multi: true,
    //     },
    //   ]),
    //   lightningcss({
    //     lightningcssOptions: {
    //       minify: !isDevelopment,
    //     },
    //   })
    // ]))
