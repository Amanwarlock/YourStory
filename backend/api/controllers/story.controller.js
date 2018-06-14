"use strict;"
var Mongoose = require("mongoose");
var http = require("http");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");
const secretKey = "ThisIsAmazing";
//var io = require("socket.io")(http);
var definition = require("../helpers/models/story.model");
var schema = new Mongoose.Schema(definition);
var Story = Mongoose.model("Story", schema);
var io = null;

function init(_io) {
    io = _io;
}

function createStory(req, res) {
    var data = req.swagger.params['data'].value;
    data.creator = req.user._id;
    var newStory = new Story(data);
    newStory.save().then(story => {
        io.emit('story', story);
        res.status(200).send({
            "message": "Story created successfully",
            "story": story
        })
    }).catch(e => res.status(400).send({ "message": e.message }));
}

function listStory(req, res) {
    var userId =  req.user._id;
    var filter = req.swagger.params['filter'].value;
    var page = req.swagger.params['page'].value;
    var count = req.swagger.params['count'].value;
    var sort = req.swagger.params['count'].value;

    filter = filter ? JSON.parse(filter) : {"creator" : userId};
    page = page ? page : 1;
    count = count ? count : 10;
    sort = sort ? JSON.parse(sort) : { "createdAt": -1 };

    var skip = count * (page - 1);

    Mongoose.models['Story'].find(filter).sort(sort).skip(skip).limit(count).lean().exec().then(storys => {
        res.status(200).send(storys);
    }).catch(e => res.status(400).send({ "message": e.message }));

}

module.exports = {
    init: init,
    createStory: createStory,
    listStory: listStory
}