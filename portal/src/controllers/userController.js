(function () {
    angular.module("userCtrl", ['userService'])
        .controller("userController", function (User) {
            var self = this;

            User.all().success(function (data) {
                self.users = data;
            });
        })
        .controller("UserCreateController", function (User, $location, $window) {
            var self = this;
            self.signUpUser = function () {
                self.message = "";
                User.create(self.userData).then(function (response) {
                    self.userData = {};
                    self.message = response.data.message;
                    $window.localStorage.setItem("token", response.data.token);
                    $location.path("/");
                });
            };
        });
})();