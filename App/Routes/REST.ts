/*
 * GET users listing.
 */

import * as express from "express";
import { Data } from "../Repository/Data";
import { Person } from "../Model/Person";

class RestRouter {

    private _router: express.Router;
    private _data: Data;

    constructor() {
        this._data = new Data("Contact List : Node/Express Backend", ["You can add contacts", "You can delete contacts", "You can sort contacts"]);
        this._router = express.Router();
        this._router.get('/', (req: express.Request, res: express.Response) => {
            res.json(this._data.entities);
        });
        this._router.get('/pages', (req: express.Request, res: express.Response) => {
            res.json(this._data.entities.pages);
        });
    }

    get router(): express.Router {
        return this._router;
    }
}


export default new RestRouter().router;