# gulp-vtouch

Change the modified time of the file in the gulp pipeline based on related dependencies.

## Usage

```js
const gulp = require('gulp');
const vtouch = require('gulp-vtouch');
const changed = require('gulp-changed');
const sass = require('gulp-sass'); 

gulp.task('default', () => {
  const dest = 'dest/style'

  return gulp.src(['src/style/*.scss'])
    .pipe(vtouch('src/style/*/**/*.scss'))
    .pipe(changed(dest))
    .pipe(sass())
    .pipe(gulp.dest(dest));
});
```
## TODO

Make fsstat async

Add support for custom rules

Glob variables to vary glob by file

Tests :-(

