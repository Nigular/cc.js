const { src, dest,series, parallel,watch } = require('gulp');
var babel = require("gulp-babel");    // 用于ES6转化ES5
var uglify = require('gulp-uglify'); // 用于压缩 JS
var concat = require('gulp-concat');   //用于合并文件
var browserSync = require('browser-sync').create();	//用于实时预览
const less = require('gulp-less');
var reload = browserSync.reload;

//压缩处理cc.js
function babeljs(){
  return src('app/jsSrc/cc.js')
      .pipe(concat('cc.min.js'))
      .pipe(babel({
          presets: ['@babel/preset-env']
      }))
      .pipe(uglify())  //压缩JS文件
      .pipe(dest('app/js'))
      .pipe(reload({stream: true}));
}

//合并压缩处理extends里的扩展js
function babeljs2(){
  return src('app/extends/*.js')
      .pipe(concat('extends.min.js'))
      .pipe(babel({
          presets: ['@babel/preset-env']
      }))
      .pipe(uglify())  //压缩JS文件
      .pipe(dest('app/js'))
      .pipe(reload({stream: true}));
}

//把cc.js输出到js里
function buildcc(){
  return src('app/jsSrc/cc.js')
      .pipe(babel({
          presets: ['@babel/preset-env']
      }))
      .pipe(uglify())  //压缩JS文件
      .pipe(dest('js'))
}

//build扩展js
function buildExtends(){
  return src('app/extends/*.js')
      .pipe(babel({
          presets: ['@babel/preset-env']
      }))
      .pipe(uglify())  //压缩JS文件
      .pipe(dest('extends'));
}

// less编译后的css将注入到浏览器里实现更新
function css(){
  return src("app/cssSrc/*.less")
      .pipe(less())
      .pipe(dest("app/css"))
      .pipe(reload({stream: true}));
}

// 初始化浏览器
function initBrowser(){
  browserSync.init({
      server: "./app"
  });
}

// 监听文件变化
function watchTask(){
  watch("app/cssSrc/*.less", series(css));
  watch("app/*.html").on('change', reload);
  watch("app/jsSrc/*.js",series(babeljs));
  watch("app/extends/*.js",series(babeljs2));
}

exports.default = parallel(initBrowser,css,watchTask);

exports.build = parallel(buildcc,buildExtends);
