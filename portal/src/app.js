(function () {
    angular.module("storyApp", ["ngMaterial","appRoutes", "mainCtrl", "authService", "userService" , "userCtrl" , "storyService" , "storyCtrl"])
        .constant("apis", {
            "base": "/api/story",
            "endpoint" : "http://localhost:9000",
            "path" :  "http://localhost:9000/api/story",
            "port": 9000
        })
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        });
})();