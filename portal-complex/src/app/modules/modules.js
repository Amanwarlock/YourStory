(function () {
    angular.module("appModules", [
        "ui.router",
        "authModule"
    ])
    .config(function($urlRouterProvider){
        $urlRouterProvider.otherwise("/login");
    });
})();