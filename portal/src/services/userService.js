(function () {
    angular.module("userService", [])
        .factory("User", function ($q, $http, apis) {
            var userFactory = {};

            userFactory.create = function (userData) {
                var _url = apis.endpoint + apis.base;
                _url += `/signUp`;
                return $http.post(_url, userData);
            };

            userFactory.all = function () {
                var url = apis.base;
                url += `/users`;
                return $http.get(url);
            };

            return userFactory;
        });
})();