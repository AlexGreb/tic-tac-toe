const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const pugLinter = require(`gulp-pug-linter`);
const htmlValidator = require(`gulp-w3c-html-validator`);
const bemValidator = require(`gulp-html-bem-validator`);;
const pug = require(`gulp-pug`);
const sass = require(`gulp-sass`);
const eslint = require(`gulp-eslint`);
const babel = require(`gulp-babel`);
const terser = require(`gulp-terser`);
const rename = require(`gulp-rename`);
const sourcemaps = require(`gulp-sourcemaps`);
const imagemin = require(`gulp-imagemin`);
const cleanCSS = require(`gulp-clean-css`);
const shorthand = require(`gulp-shorthand`);
const autoprefixer = require(`gulp-autoprefixer`);
const gulpStylelint = require(`gulp-stylelint`);
const webpack = require(`webpack-stream`);
const CircularDependencyPlugin = require(`circular-dependency-plugin`);
const DuplicatePackageCheckerPlugin = require(`duplicate-package-checker-webpack-plugin`);
const path = require(`path`);
const npmDist = require(`gulp-npm-dist`);
const del = require(`del`);
const svgstore = require(`gulp-svgstore`);
const imageminMozjpeg = require(`imagemin-mozjpeg`);

const root = path.join(__dirname)

const src = path.join(root, `js`)
const server = require(`browser-sync`).create();
const config =  {
  root,
  src,
  buildPath: path.join(root, '/build'),
  copyDependencies: {
    dist: path.join(src, 'local_modules')
  }
}


function pug2html(cb){
  return gulp.src(`*.{html,ico}`)
        .pipe(htmlValidator())
        .pipe(bemValidator())
        .pipe(gulp.dest(`build`))

}

function styles() {
  return gulp.src(`sass/*.scss`)
    .pipe(plumber())
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [
        {
          formatter: `string`,
          console: true
        }
      ]
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(shorthand())
    .pipe(cleanCSS({
      debug: true,
      compatibility: `*`
    }, details => {
      console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
    }))
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: `.min` }))
    .pipe(gulp.dest(`build/css`))
}

function script() {
  return gulp.src(`js/main.js`)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(webpack({
      mode: process.env.NODE_ENV,
      devtool: `source-map`,
      output: {
        filename: `[name].min.js`,
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: `babel-loader`,
              options: {
                presets: [`@babel/preset-env`]
              }
            }
          }
        ]
      },
      plugins: [
        new CircularDependencyPlugin(),
        new DuplicatePackageCheckerPlugin()
      ]
    }))
    .pipe(gulp.dest(`build/js`))
}

function imageMinify() {
  return gulp.src(`img/*.{gif,png,jpg,svg,webp}`)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imageminMozjpeg({
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest(`build/img`))
}



function readyReload(cb) {
  server.reload()
  cb()
}

function serve(cb) {
    server.init({
        server: `build`,
        notify: false,
        open: true,
        cors: true
    })

    gulp.watch(`img/*.{gif,png,jpg,svg,webp}`, gulp.series(imageMinify, readyReload))
    gulp.watch(`img/sprite/*.svg`, gulp.series(svgSprite, readyReload))
    gulp.watch(`sass/**/*.scss`, gulp.series(styles, cb => gulp.src(`build/css`).pipe(server.stream()).on(`end`, cb)))
    gulp.watch(`js/**/*.js`, gulp.series(script, readyReload))
    gulp.watch(`*.{html,ico}`, gulp.series(pug2html, readyReload))

    //gulp.watch(`package.json`, gulp.series(config.copyDependencies, readyReload))

    return cb()
}

function copyModules(cb) {
  del(config.copyDependencies.dist).then(() => {
    gulp.src(npmDist(), { base: path.join(config.root, `node_modules`) })
      .pipe(gulp.dest(config.copyDependencies.dist)).on(`end`, cb)
  }).catch(cb)
}

function svgSprite() {
  return gulp.src(`img/sprite/*.svg`)
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`build/img`))
}

function fonts() {
  return gulp.src(`fonts/*`)
    .pipe(gulp.dest(`build/fonts`))
}

function clean(cb) {
  return del(`build`).then(() => {
    cb()
  })
}




function setMode(isProduction = false) {
  return cb => {
    process.env.NODE_ENV = isProduction ? 'production' : 'development'
    cb()
  }
}

//const dev = gulp.parallel(pug2html, styles, script, fonts, imageMinify, svgSprite)
const dev = gulp.parallel(pug2html, styles, script, fonts, imageMinify, svgSprite)

const build = gulp.series(clean, copyModules, dev)

module.exports.start = gulp.series(setMode(), build, serve)
module.exports.build = gulp.series(setMode(true), build)
