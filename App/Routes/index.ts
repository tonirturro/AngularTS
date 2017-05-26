/*
 * GET home page.
 */
import * as express from "express";
import * as path from "path";

class IndexRouter {

    private readonly root = "wwwroot";
    private readonly defaultAnswer = "index.htm";

    private _router: express.Router;

    constructor() {
        this._router = express.Router();
        this._router.get('/', (req: express.Request, res: express.Response) => {
            res.sendFile(path.join(path.resolve(this.root), this.defaultAnswer));
        });
    }

    get router(): express.Router {
        return this._router;
    }
}


export default new IndexRouter().router;