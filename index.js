"use strict";

var PLUGIN_NAME  = 'imagemin',
    _            = require('lodash'),
    gulp         = require('gulp'),
    chalk        = require('chalk'),
    imagemin     = require('gulp-imagemin'),
    changed      = require('gulp-changed'),
    pngquant     = require('imagemin-pngquant'),
    util         = require('gulp-util'),
    elixirUtil   = require('laravel-elixir/ingredients/commands/Utilities'),
    Notification = require('laravel-elixir/ingredients/commands/Notification'),
    elixir       = require('laravel-elixir');

elixir.extend(PLUGIN_NAME, function (src, output, options) {
  var config = this, srcDir,
      output = output || './public/img/',
      // Set default options
      options = _.extend({
        // Imagemin options
        imagemin: {
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()]
        },
        // Elixir related
        srcDir: config.assetsDir + 'images'
      }, options);

  // Use either specified source or search for everything within this directory
  srcDir = options.srcDir;
  src = elixirUtil.buildGulpSrc(src, srcDir, '**/*');

  // Create gulp task
  gulp.task(PLUGIN_NAME, function () {
    return gulp.src(src)
      .pipe(changed(output))
      .pipe(imagemin(options.imagemin))
      .pipe(gulp.dest(output))
      .on('error', function () {
        util.log(chalk.red('error occured while running ' + PLUGIN_NAME));
      });
  });

  this.registerWatcher(PLUGIN_NAME, srcDir + '/**/*.{png,gif,svg,jpg,jpeg}');
  return this.queueTask(PLUGIN_NAME);
});