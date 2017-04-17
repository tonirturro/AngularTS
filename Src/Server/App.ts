
// Define and export a singletpn for the application.
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

class App {
    // Routes

    private readonly rest_path = "/REST";
    private readonly view_path = "/View";
    private readonly lib_path = "/Lib";

    // Host express
    public express: express.Application;

    // Initialzes a new instance of the App class
    constructor() {
        this.express = express();
        this.setStaticServer();
        this.setRESTServer();
        this.routes();
    }

    // Configure the files that will be served statically.
    private setStaticServer(): void {
        // Main page and includes
        const index_path = this.view_path + "/index.htm";
        this.express.get("/", function(err, res) {
            res.sendFile(__dirname + index_path);
        });

        const form_path = this.view_path + "/users_form.htm";
        this.express.get(form_path, function(err, res) {
            res.sendFile(__dirname + form_path);
        })

        const grid_path =this.view_path + "/users_grid.htm";
        this.express.get(grid_path, function(err,res) {
            res.sendFile(__dirname + grid_path);
        });

        // Bootstrap
        const bootstrap_path = this.lib_path + "/bootstrap.css";
        this.express.get(bootstrap_path, function(err, res) {
            res.sendFile(__dirname + bootstrap_path);
        });

        // Angular
        const angular_path = this.lib_path + "/angular.js";
        this.express.get(angular_path, function(err, res) {
            res.sendFile(__dirname + angular_path);
        });

        // Application
        const app_path =this.view_path + "/scripts/main.js";
        this.express.get(app_path, function(err, res) {
            res.sendFile(__dirname + app_path);
        });

        // The simulated model
        const model_path = "/data.json";
        this.express.get(model_path, function(err, res) {
            res.sendFile(__dirname + model_path);
        });
    }

    // Configure Express middleware for REST API
    private setRESTServer() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
    }

    // Configure routes
    private routes(): void
    {
        let router = express.Router();

        router.get("/", (req, res) => {
            res.json({
                message: 'Hello World'
            });
        });

        this.express.use(this.rest_path, router);
    }
}

export default new App().express;
