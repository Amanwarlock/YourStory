var gulp = require("gulp");
var browerSync = require("browser-sync").create();


/* Static server + watching scss/html files */
gulp.task('serve', function () {
    browerSync.init({
        port: 5000,
        server: "./src"
    });

    gulp.watch(["src/*.html"]).on('change', browerSync.reload);
    gulp.watch("src/*.js").on('change', browerSync.reload);
});