import * as express from "express";
import { Data } from "../Repository/Data";

/**
 * Handles the routes to the REST api
 */
class RestRouter {

    private _router: express.Router;
    private _data: Data;

    /**
     * Initializes a new instance of the RestRouter class.
     */
    constructor() {
        this._data = new Data();
        this._router = express.Router();

        // Access to the pages repository
        this._router.get('/pages', (req: express.Request, res: express.Response) => {
            res.json(this._data.getPages());
        });

        // Add new page
        this._router.put('/pages', (req: express.Request, res: express.Response) => {
            res.json({ success: true });
        });

        // Delete a page
        this._router.delete('/pages/:pageId', (req: express.Request, res: express.Response) => {
            var pageIdToDelete = parseInt(req.params.pageId)
            res.json({ deletedPageId: pageIdToDelete, success: true });
        });
    }

    /**
    /* Retrieve the router
    */
    get router(): express.Router {
        return this._router;
    }
}


export default new RestRouter().router;