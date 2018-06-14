(function () {
    angular.module("storyService", [])
        .service("Story", function ($q, $http, apis, AuthToken) {
            var storyFactory = {};

            /*  storyFactory.createStory = function (storyData) {
                 var url = apis.path;
                 url += `/createStory`;
                 return $http.post(url, storyData);
             } */

            storyFactory.createStory = function (storyData) {
                var url = apis.path;
                url += `/createStory`;
                var token = AuthToken.getToken();
                return $http({
                    "method": "post",
                    "url": url,
                    "data": storyData
                });
            }

            storyFactory.storyList = function () {
                var url = apis.path;
                url += `/listStory`;
                return $http.get(url);
            }

            return storyFactory;
        })
        .factory('socketIo', function ($rootScope) {
            var socket = io.connect("http://localhost:9000");
            return {
                on: function (eventName, callback) {
                    socket.on(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket , args);
                        });
                    })
                },
                emit: function(eventName , data , callback){
                    socket.emit(eventName , data , function(){
                        var args = arguments;
                        $rootScope.$apply(function(){
                            if(callback){
                                callback.apply(socket , args);
                            }
                        });
                    });
                }
            }
        });
})();