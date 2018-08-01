var gulp = require("gulp");
var gulpTypescript = require("gulp-typescript");
var tsProject = gulpTypescript.createProject("./tsconfig.json");

gulp.task("build", () => {
    return tsProject.src().pipe(tsProject()).pipe(gulp.dest("./dist"));
})