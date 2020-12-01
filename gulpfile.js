const {src, dest, watch, parallel, series} = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const terser = require("gulp-terser");//using instead uglify because doesn-t support e6
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
let replace = require("gulp-replace");

const files = {
    scssPath: "app/scss/**/*.scss",
    jsPath: "app/js/**/*.js",
    imgPath: "app/images/**/*"
}

scssTask = () => {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", err => {
            console.log(err)
        }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/scss")
    );
}

jsTask = () => {
    return src([files.jsPath])
        .pipe(concat("all.js"))
        // .pipe(uglify().on("error", err => {
        //     console.log(err)
        // }))
        .pipe(terser())
        .pipe(dest("dist/js")
    );
}

imageminTask = () => {
    return src(files.imgPath)
        .pipe(imagemin())
        .pipe(dest("dist/images")
    );
}

casheBustTask = () => {
    let cbString = new Date().getTime();
    return src(["index.html"])
        .pipe(replace(/cb=\d+/g, `cb=${cbString}`))
        .pipe(dest(".")
    );
}

watchTask = () => {
    watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask));
}

exports.default = series(
    parallel(scssTask, jsTask),
    casheBustTask,
    imageminTask,
    watchTask
);