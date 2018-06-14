"use strict;"
var Mongoose = require("mongoose");
var http = require("http");
var userCtrl = require("./user.controller");
var storyCtrl = require("./story.controller");
var io = null;


function init(_io) {
    io = _io;
    storyCtrl.init(io);
}

const url = "mongodb://localhost/yourStory"

Mongoose.connect(url, function (err) {
    if (err)
        console.log(err);
    else
        console.log("Connected to Db");
});

module.exports = {
    init: init,
    v1_login: userCtrl.login,
    v1_currentUser: userCtrl.currentUser,
    v1_createUser: userCtrl.createUser,
    v1_userList: userCtrl.list,
    v1_createStory: storyCtrl.createStory,
    v1_listStory: storyCtrl.listStory
}