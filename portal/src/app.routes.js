(function () {
    angular.module('appRoutes', ['ngRoute'])
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider
                .when("/", {
                    templateUrl: "views/home.html",
                    controller : "MainController",
                    controllerAs : 'main'
                })
                .when("/login", {
                    templateUrl: "views/login.html"
                })
                .when("/signup" , {
                    templateUrl: "views/signup.html"
                });
        });
    $locationProvider.html5Mode(true);
})();