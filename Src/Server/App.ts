
// Define and export a singletpn for the application.
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

class App {
    // Routes

    private readonly restPath = "/REST";
    private readonly viewPath = "/View";
    private readonly libPath = "/Lib";

    // Host express
    public express: express.Application;

    // Initialzes a new instance of the App class
    constructor() {
        this.express = express();
        this.setStaticServer();
        this.setRestServer();
        this.routes();
    }

    // Configure the files that will be served statically.
    private setStaticServer(): void {
        // Main page and includes
        const indexPath = this.viewPath + "/index.htm";
        this.express.get("/", (err, res) => {
            res.sendFile(__dirname + indexPath);
        });

        const formPath = this.viewPath + "/users_form.htm";
        this.express.get(formPath, (err, res) => {
            res.sendFile(__dirname + formPath);
        })

        const gridPath =this.viewPath + "/users_grid.htm";
        this.express.get(gridPath, (err, res) => {
            res.sendFile(__dirname + gridPath);
        });

        // Bootstrap
        const bootstrapPath = this.libPath + "/bootstrap.css";
        this.express.get(bootstrapPath, (err, res) => {
            res.sendFile(__dirname + bootstrapPath);
        });

        // Angular
        const angularPath = this.libPath + "/angular.js";
        this.express.get(angularPath, (err, res) => {
            res.sendFile(__dirname + angularPath);
        });

        // Application
        const appPath =this.viewPath + "/scripts/main.js";
        this.express.get(appPath, (err, res) => {
            res.sendFile(__dirname + appPath);
        });

        // The simulated model
        const modelPath = "/data.json";
        this.express.get(modelPath, (err, res) => {
            res.sendFile(__dirname + modelPath);
        });
    }

    // Configure Express middleware for REST API
    private setRestServer() {
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

        this.express.use(this.restPath, router);
    }
}

export default new App().express;
