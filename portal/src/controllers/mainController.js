(function () {
    angular.module('mainCtrl', [])
        .controller("MainController", function ($rootScope, $scope, $location, Auth) {
            var self = this;

            self.loggedIn = Auth.isLoggedIn();

            $rootScope.$on("$routeChangeStart", function () {
                self.loggedIn = Auth.isLoggedIn();

                Auth.getUser().then(data => {
                    self.user = data;
                });
            });

            self.doLogin = function () {
                self.processing = true;
                Auth.login(self.loginData.username, self.loginData.password).then(data => {
                    self.processing = false;
                    Auth.getUser().then(user => {
                        self.user = user;
                    });
                    
                    if (data.success) {
                        $location.path("/");
                    } else {
                        self.error = "Login Error";
                    }

                }).catch(e => console.log(e));
            };


            self.doLogout = function () {
                Auth.logout();
                $location.path('/logout');
            }

        });
})();