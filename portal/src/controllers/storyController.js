(function () {
    angular.module("storyCtrl", ["storyService"])
        .controller("storyController", function (Story , socketIo) {
            var self = this;
            self.stories = [];

            Story.storyList().then(data => {
                self.stories = data.data;
            }).catch(e => console.error(e));

            self.createStory = function () {
                Story.createStory(self.storyData).then(data => {
                    self.storyData = {}; //clear the user input;
                    self.message = data.message;
                    self.stories.unshift(data.story);
                }).catch(e => console.error(e));
            };

            socketIo.on('story' , function(data){
                console.log("socket io data---" , data);
                self.stories.unshift(data);
               // self.stories =  [data].concat(self.stories);
            })

        });
})();