/**
 * @author AmanKareem
 */
"use strict;"
const express = require("express");
const path = require("path");
const http = require("http");
const config = require("./config");
const port = config.port ? config.port : 6000;
const app = express();

app.use(express.static(path.join(__dirname, '/portal')));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname , `/index.html`));
})

app.listen(port, () => console.log(`Server started on port ${port} visit http://localhost:${port}`));