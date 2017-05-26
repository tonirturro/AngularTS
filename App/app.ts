import * as express from "express";
import path = require('path');

import routes from './Routes/index';
import restApi from './Routes/REST';

var app = express();

const root = "wwwroot";

app.use(express.static(path.resolve(root)));

app.use('/', routes);
app.use('/REST', restApi);

export = app;
