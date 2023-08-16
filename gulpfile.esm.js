import { src, dest, series, parallel } from "gulp";
import pug from "gulp-pug";
import stylus from "gulp-stylus";
import clean from "gulp-clean";
import terser from "gulp-terser";
import nop from "gulp-nop";

const SRC = "./src/",
  DEST = "./_dest";
let min = false;

export function html() {
  return src(SRC + "*.pug")
    .pipe(pug({ pretty: !min }))
    .pipe(dest(DEST));
}

export function css() {
  return src(SRC + "*.styl")
    .pipe(stylus({ compress: min }))
    .pipe(dest(DEST));
}

export function js() {
  return src(SRC + "*.js")
    .pipe(min ? terser() : nop())
    .pipe(dest(DEST));
}

async function upload() {
  console.log("Загружаем файлы на сервер");
}

async function serv() {
  console.log("dev server");
}

async function setMin() {
  min = true;
}

export function cleanDir() {
  return src(DEST + "**/*.*", { read: false }).pipe(clean());
}

export const make = parallel(html, css, js);

export const prod = series(setMin, cleanDir, make, upload);
export const dev = series(make, serv);
export default dev;
