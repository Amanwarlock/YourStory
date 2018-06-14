(function () {
    angular.module("authService", [])
        .factory('Auth', function ($http, $q, AuthToken, apis) {
            var authFactory = {};

            /* Login */
            authFactory.login = function (username, password) {
                var defer = $q.defer();
                var _url = `http://localhost:9000${apis.base}/login`;
                var data = {
                    "username": username,
                    "password": password
                }
                $http({
                    "method": "post",
                    "url": _url,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": data
                })
                    .then(data => {
                        AuthToken.setToken(data.data.token);
                        defer.resolve(data.data);
                    })
                    .catch(function (e) {
                        defer.reject(e);
                    });
                return defer.promise;
            };

            /* Logout */
            authFactory.logout = function () {
                AuthToken.setToken(); //set to empty or clear token;
            };

            authFactory.isLoggedIn = function () {
                if (AuthToken.getToken()) {
                    return true;
                } else {
                    return false;
                }
            };

            authFactory.getUser = function () {
                var defer = $q.defer();
                var token = AuthToken.getToken();
                if (token) {
                    var _url = `http://localhost:9000/api/story/me`; //http://localhost:9000/api/story/me?token=${token}`;
                    $http({
                        "method": "GET",
                        "url": _url,
                       /*  "headers": {
                            "Content-Type": "application/json",
                            "x-access-token" : token,
                            "Authorization" : token
                        } */
                    }).then(user => {
                        defer.resolve(user.data);
                    }).catch(e => defer.reject(e));
                } else {
                    defer.reject({ "message": "Unauthorized" });
                }

                return defer.promise;
            }

            return authFactory;
        })
        .factory("AuthToken", function ($window) {
            var authTokenFactory = {};

            authTokenFactory.setToken = function (token) {
                if (token) {
                    $window.localStorage.setItem('token', token);
                } else {
                    $window.localStorage.removeItem('token');
                }
            };

            authTokenFactory.getToken = function () {
                return $window.localStorage.getItem('token');
            };

            return authTokenFactory;
        })
        .factory("AuthInterceptor", function ($q, $location, AuthToken) {
            var interceptorFactory = {};

            interceptorFactory.request = function (config) {
                var token = AuthToken.getToken();
                if (token) {
                    config.headers['x-access-token'] = token;
                    config.headers["Authorization"] = token;
                }
                return config;
            };

            /* Invalid token or not logged in */
            interceptorFactory.responseError = function (response) {
                if (response.status === 403) {
                    $location.path('/login');
                    AuthToken.setToken();
                }

                return $q.reject(response);
            };

            return interceptorFactory;
        });
})();