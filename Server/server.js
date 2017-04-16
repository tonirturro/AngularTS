const http = require("http");
const express = require ('express');

const app = express();
const server = http.createServer(app);

const view_path = "/View";
const lib_path = "/Lib";

// Main page and includes 
app.get("/", function(err, res) {
    res.sendFile(__dirname + view_path + "/index.htm");
});

const form_path =  view_path + "/users_form.htm";
app.get(form_path, function(err, res) {
    res.sendFile(__dirname + form_path);
})

const grid_path =  view_path + "/users_grid.htm";
app.get(grid_path, function(err,res) {
    res.sendFile(__dirname + grid_path);
});

// Bootstrap
const bootstrap_path = lib_path + "/bootstrap.css";
app.get(bootstrap_path, function(err, res) {
    res.sendFile(__dirname + bootstrap_path);
});

// Angular
const angular_path = lib_path + "/angular.js";
app.get(angular_path, function(err, res) {
    res.sendFile(__dirname + angular_path);
});

// Application
const app_path =  view_path + "/scripts/main.js";
app.get(app_path, function(err, res) {
    res.sendFile(__dirname + app_path);
});

// The simulated 
const model_path = "/data.json";
app.get(model_path, function(err, res) {
    res.sendFile(__dirname + model_path);
});

// App start
server.listen(3000, function() {
    console.log("Server listening on port 3000");
});
