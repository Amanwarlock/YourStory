(function () {
    angular.module("authModule", ["ui.router"])
        .config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider
            .state("login", {
                url: "/login",
                templateUrl: "src/app/modules/auth/login.html",
                controller: "authController",
                title: "Login"
            });
    }
})();