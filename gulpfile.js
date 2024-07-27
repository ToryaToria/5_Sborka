import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-';
import htmlmin from 'gulp-htmlmin';
import terser from 'terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';


/* ================================================== */

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

/* ================================================== */

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


/* ================================================== */


// HTML

const html = () => {
	return gulp.src('source/*.html')
		.pipe(htmlmin({ collapseWhitespace: !isDevelopment }))
		.pipe(gulp.dest('build'));
}

/* ================================================== */

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

	/* ================================================== */

// Images

const optimizeImages = () => {
	return gulp.src('source/img/**/*.{png,jpg}')
	.pipe(squoosh())
	.pipe(gulp.dest('build/img'))
	}
	
	const copyImages = () => {
	return gulp.src('source/img/**/*.{png,jpg}')
	.pipe(gulp.dest('build/img'))
	}
	

	// export function optimizeRaster () {
	// 	const RAW_DENSITY = 2;
	// 	const TARGET_FORMATS = [undefined, 'webp']; // undefined — initial format: jpg or png
	
	// 	function createOptionsFormat() {
	// 		const formats = [];
	
	// 		for (const format of TARGET_FORMATS) {
	// 			for (let density = RAW_DENSITY; density > 0; density--) {
	// 				formats.push(
	// 					{
	// 						format,
	// 						rename: { suffix: `@${density}x` },
	// 						width: ({ width }) => Math.ceil(width * density / RAW_DENSITY),
	// 						jpegOptions: { progressive: true },
	// 					},
	// 				);
	// 			}
	// 		}
	
	// 		return { formats };
	// 	}

// 	return src(`${PATH_TO_RAW}images/**/*.{png,jpg,jpeg}`)
// 	.pipe(sharp(createOptionsFormat()))
// 	.pipe(dest(`${PATH_TO_SOURCE}images`));
// }

	/* ================================================== */


	// WebP
	
	const createWebp = () => {
	return gulp.src('source/img/**/*.{png,jpg}')
	.pipe(squoosh({
	webp: {}
	}))
	.pipe(gulp.dest('build/img'))
	}
	
		/* ================================================== */

	// SVG

const svg = () =>
gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
.pipe(svgo())
.pipe(gulp.dest('build/img'));

// export function optimizeVector () {
//   return src([`${PATH_TO_RAW}**/*.svg`])
//     .pipe(svgo())
//     .pipe(dest(PATH_TO_SOURCE));
// }

	/* ================================================== */


const sprite = () => {
return gulp.src('source/img/icons/*.svg')
.pipe(svgo())
.pipe(svgstore({
inlineSvg: true
}))
.pipe(rename('sprite.svg'))
.pipe(gulp.dest('build/img'));
}

// export function createStack () { // из новой сборки
//   return src(`${PATH_TO_SOURCE}icons/**/*.svg`)
//     .pipe(stacksvg())
//     .pipe(dest(`${PATH_TO_DIST}icons`));
// }


/* ================================================== */


// Copy

const copy = (done) => {
	gulp.src([
	'source/fonts/*.{woff2,woff}',
	'source/*.ico',
	], {
	base: 'source'
	})
	.pipe(gulp.dest('build'))
	done();
	}
	

	// export function copyStatic () {
	// 	return src(PATHS_TO_STATIC, { base: PATH_TO_SOURCE })
	// 		.pipe(dest(PATH_TO_DIST));
	// }


		/* ================================================== */

	// Clean

const clean = () => {
	return del('build');
	};

		/* ================================================== */


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

	/* ================================================== */


	// Reload

const reload = (done) => {
	browser.reload();
	done();
	}

		/* ================================================== */

// Watcher

const watcher = () => {
	gulp.watch('source/sass/**/*.scss', gulp.series(styles));
	gulp.watch('source/*.html', gulp.series(html, reload));
	// gulp.watch('source/*.html').on('change', browser.reload);  - то, что у нас сейчас

	// gulp.watch('source/js/script.js', gulp.series(scripts));
	}

	/* ================================================== */

// Default

export default gulp.series(
	html, styles, server, watcher
	);


