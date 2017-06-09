import * as express from "express";
import { Data } from "../Repository/Data";

/**
 * Handles the routes to the REST api
 */
export class RestRouter {

    private _router: express.Router;
    private _data: Data;

    /**
     * Initializes a new instance of the RestRouter class.
     */
    constructor(data : Data) {
        this._data = data;
        this._router = express.Router();

        // Access to the pages repository
        this._router.get('/pages', (req: express.Request, res: express.Response) => {
            res.json(this._data.getPages());
        });

        // Add new page
        this._router.put('/pages', (req: express.Request, res: express.Response) => {
            this._data.newPage();
            res.json({ success: true });
        });

        // Delete a page
        this._router.delete('/pages/:pageId', (req: express.Request, res: express.Response) => {
            var pageIdToDelete = parseInt(req.params.pageId);
            var result = this._data.deletePage(pageIdToDelete);
            res.json({
                deletedPageId: pageIdToDelete,
                success: result
            });
        });

        // Update page sizes
        this._router.put('/pages/pageSize', (req: express.Request, res: express.Response) => {
            var pages = req.body.pages;
            if (pages) {
                var newValue = req.body.newValue;
                var result = true;

                pages.forEach(page => {
                    result = result && this._data.updatePageSize(page, newValue);
                })

                res.json({
                    success: result
                });                
            } else {
                res.json({
                    success: false
                });                                
            }
        });
    }

    /**
    /* Retrieve the router
    */
    get router(): express.Router {
        return this._router;
    }
}
