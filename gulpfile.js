import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import htmlmin from 'gulp-htmlmin';
import terser from 'terser';


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
			autoprefixer(),
			csso()
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



// HTML

const html = () => {
	return gulp.src('source/*.html')
		.pipe(htmlmin({ collapseWhitespace: !isDevelopment }))
		.pipe(gulp.dest('build'));
}

// Scripts

export const scripts = () => {
	return gulp.src('source/js/script.js')

	.pipe(terser())

	.pipe(gulp.dest('build/js'))
	.pipe(browser.stream());
	}


	// export function processScripts () {
	// 	const gulpEsbuild = createGulpEsbuild({ incremental: isDevelopment });
	
	// 	return src(`${PATH_TO_SOURCE}scripts/*.js`)
	// 		.pipe(gulpEsbuild({
	// 			bundle: true,
	// 			format: 'esm',
	// 			// splitting: true,
	// 			platform: 'browser',
	// 			minify: !isDevelopment,
	// 			sourcemap: isDevelopment,
	// 			target: browserslistToEsbuild(),
	// 		}))
	// 		.pipe(dest(`${PATH_TO_DIST}scripts`))
	// 		.pipe(server.stream());
	// }



// Server

const server = (done) => {
browser.init({
server: {
baseDir: 'build'
},
cors: true,
notify: false,
ui: false,
});
done();
}


// Watcher

const watcher = () => {
	gulp.watch('source/sass/**/*.scss', gulp.series(styles));
	gulp.watch('source/*.html', gulp.series(html, reload));
	// gulp.watch('source/*.html').on('change', browser.reload);  - то, что у нас сейчас

	// gulp.watch('source/js/script.js', gulp.series(scripts));
	}


// Default

// export default gulp.series(
// 	html, styles, server, watcher
// 	);


// сервер из #19 разобрать!

// export function startServer () {
//   const serveStatic = PATHS_TO_STATIC
//     .filter((path) => path.startsWith('!') === false)
//     .map((path) => {
//       const dir = path.replace(/(\/\*\*\/.*$)|\/$/, '');
//       const route = dir.replace(PATH_TO_SOURCE, '/');

//       return { route, dir };
//     });

//   server.init({
//     server: {
//       baseDir: PATH_TO_DIST
//     },
//     serveStatic,
//     cors: true,
//     notify: false,
//     ui: false,
//   }, (err, bs) => {
//     bs.addMiddleware('*', (req, res) => {
//       res.write(readFileSync(`${PATH_TO_DIST}404.html`));
//       res.end();
//     });
//   });

//   watch(`${PATH_TO_SOURCE}**/*.{html,njk}`, series(processMarkup));
//   watch(`${PATH_TO_SOURCE}styles/**/*.scss`, series(processStyles));
//   watch(`${PATH_TO_SOURCE}scripts/**/*.js`, series(processScripts));
//   watch(`${PATH_TO_SOURCE}icons/**/*.svg`, series(createStack, reloadServer));
//   watch(PATHS_TO_STATIC, series(reloadServer));
// }