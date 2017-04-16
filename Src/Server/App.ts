
// Define and export a singletpn for the application.
import * as express from 'express';

class App {
    // Host express
    public express: express.Application;

    // Initialzes a new instance of the App class
    constructor() {
        this.express = express();
        this.setStaticServer();
    }

    // Configure the files that will be served statically.
    private setStaticServer(): void {
        const view_path = "/View";
        const lib_path = "/Lib";

        // Main page and includes 
        this.express.get("/", function(err, res) {
            res.sendFile(__dirname + view_path + "/index.htm");
        });

        const form_path =  view_path + "/users_form.htm";
        this.express.get(form_path, function(err, res) {
            res.sendFile(__dirname + form_path);
        })

        const grid_path =  view_path + "/users_grid.htm";
        this.express.get(grid_path, function(err,res) {
            res.sendFile(__dirname + grid_path);
        });

        // Bootstrap
        const bootstrap_path = lib_path + "/bootstrap.css";
        this.express.get(bootstrap_path, function(err, res) {
            res.sendFile(__dirname + bootstrap_path);
        });

        // Angular
        const angular_path = lib_path + "/angular.js";
        this.express.get(angular_path, function(err, res) {
            res.sendFile(__dirname + angular_path);
        });

        // Application
        const app_path =  view_path + "/scripts/main.js";
        this.express.get(app_path, function(err, res) {
            res.sendFile(__dirname + app_path);
        });

        // The simulated model
        const model_path = "/data.json";
        this.express.get(model_path, function(err, res) {
            res.sendFile(__dirname + model_path);
        });
    }
}

export default new App().express;
