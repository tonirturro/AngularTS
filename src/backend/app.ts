import * as bodyParser from "body-parser";
import * as express from "express";
import path = require("path");

import { Data } from "./Repository/Data";
import { RestRouter } from "./Routes/REST";

const app = express();

const root = "dist";

// Resolve dependencies
const data = new Data();
const restApi = new RestRouter(data).Router;

// Initialize app
app.use(express.static(path.resolve(root)));
app.use(bodyParser.json());

app.use("/REST", restApi);

export const main = {
    application: app,
    dependencies : {
        dataLayer : data
    } };
