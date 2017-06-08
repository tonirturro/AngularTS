import * as express from "express";
import * as bodyParser from "body-parser";
import path = require('path');

import routes from './Routes/index';
import { RestRouter } from './Routes/REST';
import { Data } from "./Repository/Data";

var app = express();

const root = "wwwroot";

// Resolve dependencies
var data = new Data();
var restApi = new RestRouter(data).router;

// Initialize app
app.use(express.static(path.resolve(root)));
app.use(bodyParser.json());

app.use('/', routes);
app.use('/REST', restApi);

export = { 
    application: app, 
    dependencies : { 
        dataLayer :data 
    } };
