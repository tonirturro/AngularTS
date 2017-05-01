
// Define and export a singletpn for the application.
import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as fs from "fs";
import * as path from "path";
import { Data } from "./Repository/Data";
import { Person } from "./View/Model/Person";

export class App {
    // Routes
    private readonly restPath = "/REST";
    private readonly viewPath = "/View";
    private readonly libPath = "/Lib";
    private readonly modelPath = `${this.viewPath}/Model`;
    private readonly servicesPath = `${this.viewPath}/Services`;
    private readonly nodeModulesPath = "/node_modules";

    // Host express
    private _express: express.Application;

    // Host model
    private _model: Data;

    // Initialzes a new instance of the App class
    constructor(express: express.Application) {
        this._express = express;
        this.initModel();
        this.setStaticServer();
        this.setRestServer();
        this.routes();
    }

    // Gets the express instance
    get express(): express.Application {
        return this._express;
    }

    private initModel()
    {
        // Get the simulated model
        const modelPath = "/data.json";
        var data = fs.readFileSync(__dirname + modelPath);
        if (data) {
            var model = JSON.parse(data.toString());

            this._model = new Data(model.message, model.items);
            for (let person of model.people) {
                this._model.addPerson(new Person(person.id, person.givenName, person.famillyName));
            }
        }     
    }

    // Configure the files that will be served statically.
    private setStaticServer(): void {
        // No Icon
        const iconPath = "favicon.ico";
        this._express.get(iconPath, (err, res) => {
            res.send(204);
        });

        // Main page and includes
        const indexPath = `${this.viewPath}/index.htm`;
        this._express.get("/", (err, res) => {
            res.sendFile(__dirname + indexPath);
        });

        const formPath = `${this.viewPath}/users_form.htm`;
        this._express.get(formPath, (err, res) => {
            res.sendFile(__dirname + formPath);
        });

        const gridPath = `${this.viewPath}/users_grid.htm`;
        this._express.get(gridPath, (err, res) => {
            res.sendFile(__dirname + gridPath);
        });

        // Bootstrap
        const bootstrapPath = `${this.libPath}/bootstrap.css`;
        this._express.get(bootstrapPath, (err, res) => {
            res.sendFile(__dirname + bootstrapPath);
        });

        // Angular
        const angularPath = `${this.nodeModulesPath}/angular/angular.js`;
        this._express.get(angularPath, (err, res) => {
            res.sendFile(path.resolve(`.${angularPath}`));
        });

        // System.js
        const systemJSPath = "/system.js";
        this._express.get(systemJSPath, (err, res) => {
            res.sendFile(path.resolve(`.${this.nodeModulesPath}/systemjs/dist/${systemJSPath}`));
        });

        // System.config.js
        const systemJSConfigPath = `${this.libPath}/system.config.js`;
        this._express.get(systemJSConfigPath, (err, res) => {
            res.sendFile(__dirname + systemJSConfigPath);
        });

        // Boot
        const bootPath = `${this.viewPath}/Boot`;
        this._express.get(bootPath, (err, res) => {
            res.sendFile(__dirname + bootPath + ".js");
        });

        // Main Controller
        const mainControllerPath = `${this.viewPath}/MainController`;
        this._express.get(mainControllerPath, (err, res) => {
            res.sendFile(__dirname + mainControllerPath + ".js");
        });

        // Data service
        const dataServicePath = `${this.servicesPath}/DataService`;
        this._express.get(dataServicePath, (err, res) => {
            res.sendFile(__dirname + dataServicePath + ".js");
        });
           
        // Person
        const personPath = `${this.modelPath}/Person`;
        this._express.get(personPath, (err, res) => {
            res.sendFile(__dirname + personPath + ".js");
        })
    }

    // Configure Express middleware for REST API
    private setRestServer() {
        this._express.use(logger("dev"));
        this._express.use(bodyParser.json());
    }

    // Configure routes
    private routes(): void
    {
        const router = express.Router();

        router.get("/", (req, res) => {
            res.json(this._model);
        });

        this._express.use(this.restPath, router);
    }
}

