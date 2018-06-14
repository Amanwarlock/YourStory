"use strict;"
var Mongoose = require("mongoose");
var http = require("http");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");
const secretKey = "ThisIsAmazing";
var definition = require("../helpers/models/user.model");
var schema = new Mongoose.Schema(definition);
var User = Mongoose.model("User", schema);
//var user = new User()

schema.methods.comparePassword = function (password) {
    var self = this;

    return bcrypt.compareSync(password, self.password);
};

schema.pre("save", hashPassword);


function hashPassword(next) {
    var self = this;
    bcrypt.hash(self.password, null, null, function (err, hash) {
        if (err)
            next(err);
        else {
            self.password = hash;
            next();
        }

    })
}

function comparePassword(password, userPwd) {
    return bcrypt.compareSync(password, userPwd);
}

function createJWTToken(user) {
    var token = jwt.sign({
        _id: user._id,
        name: user.username
    }, secretKey, { expiresIn: 1440 }); //1440

    return token;
}

/* Sign up */
function createUser(req, res) {
    var data = req.swagger.params['data'].value;
    var newUser = new User(data);
    newUser.save().then(user => {
        //create new token here;
        var token = createJWTToken(user);
        res.status(200).send({
            "successs": true,
            "token": token,
            "message": "sign up complete",
            "user": user
        });
    }).catch(e => res.status(400).send({ "message": e.message }));
}

function list(req, res) {
    var filter = req.swagger.params['filter'].value;
    filter = filter ? JSON.parse(filter) : {};
    Mongoose.models['User'].find(filter).exec().then(users => {
        res.status(200).send(users);
    }).catch(e => res.status(400).send({ "message": e.message }));
}

function login(req, res) {
    let params = req.swagger.params['data'].value;
    const username = params['username'];
    const password = params['password'];
    Mongoose.models["User"].findOne({ "username": username }).select(" username password").exec().then(user => {
        if (user) {
            //var isValidPassword = user.comparePassword(password);
            var isValidPassword = comparePassword(password, user.password);
            if (isValidPassword) {
                //generate JWT web token;
                var token = createJWTToken(user);
                res.status(200).send({
                    "success": true,
                    "message": "Successfully Logged In",
                    "token": token
                });
            } else {
                res.status(403).send({ "message": "Invalid Password" });
            }
        } else {
            res.status(403).send({ "message": "User does not exits" });
        }
    }).catch(e => res.status(400).send({ "message": e.message }));
}

function currentUser(req, res) {
    var _id = req.user._id;
    var username = req.user.username;
    Mongoose.models['User'].findOne({ _id: _id }).lean().exec().then(user => {
        res.status(200).send(user);
    }).catch(e => res.status(400).send({ "message": e.message }));
}

module.exports = {
    createUser: createUser,
    login: login,
    list: list,
    currentUser: currentUser
}