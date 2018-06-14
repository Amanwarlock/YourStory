'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var bp = require("body-parser");
var morgan = require("morgan");
var jwt = require("jsonwebtoken");
var cors = require("cors");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var controller = require("./api/controllers/controller");
const secretKey = "ThisIsAmazing";

controller.init(io);

io.on("connection", function (socket) {
  console.log("-------------------------User connected to socket.io--------------------");
});

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors()); // Enable CORS in node backend API's to enable cross service - cross origin calls;
/*
  Enable CORS in node backend API's
 */
/* app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); */

app.use(function (req, res, next) {
  var token = req.body.token || req.params['token'] || req.headers['Authorization'] || req.headers['x-access-token'] || req.query['token'];
  if (req.url == "/api/story/login" || req.url == "/api/story/signUp") {
    next();
  } else if (token) {
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) {
        res.status(403).send({ "message": "Authentication failed ,access forbidden" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } /* else if (req.url === "/api/story/createStory" || req.url === "/api/story/listStory") {
    // io.emit('story', {"content" : "Aman warlock socket io story.."}); // This works
    next();
  } */
  else {
    res.status(403).send({ "message": "No Token , access forbidden" });
  }
});

module.exports = {
  app: app,
  io: io
}; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 9000;
  http.listen(port);

});
