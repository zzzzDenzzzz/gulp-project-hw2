import { src, dest, series, parallel, watch } from "gulp";
import pug from "gulp-pug";
import stylus from "gulp-stylus";
import clean from "gulp-clean";
import terser from "gulp-terser";
import nop from "gulp-nop";
import { create } from "browser-sync";

const browserSync = create(),
  SRC = "./src/",
  DEST = "./_dest/",
  PUG_SOURCE = SRC + "**/*.pug",
  STYL_SOURCE = SRC + "*.styl",
  JS_SOURCE = SRC + "*.js";

let minification = false;

export function html() {
  return src([PUG_SOURCE, "!./src/_includes/**/*.*"])
    .pipe(pug({ pretty: !minification }))
    .pipe(dest(DEST));
}

export function css() {
  return src(STYL_SOURCE, { sourcemaps: !minification })
    .pipe(stylus({ compress: minification }))
    .pipe(dest(DEST, { sourcemaps: "." }));
}

export function js() {
  return (
    src(JS_SOURCE, { sourcemaps: !minification })
      .pipe(minification ? terser() : nop())
      .pipe(dest(DEST))
  );
}

async function setMinification() {
  minification = true;
}

export function cleanDir() {
  return src(DEST + "**/*.*", { read: false }).pipe(clean());
}

const browserSyncReload = async () => browserSync.reload();

export async function serv() {
  browserSync.init({ server: { baseDir: DEST } });
  watch(DEST + "**/*.*", browserSyncReload);
  watch(PUG_SOURCE, html);
  watch(STYL_SOURCE, css);
  watch(JS_SOURCE, js);
}

export const make = parallel(html, css, js);

export const prod = series(setMinification, cleanDir, make, upload);
export const dev = series(make, serv);
export default dev;

async function upload() {
  console.log("Загружаем файлы на сервер");
}
