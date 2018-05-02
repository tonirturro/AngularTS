/*
 * GET home page.
 */
import * as express from "express";
import * as path from "path";

class IndexRouter {

    private readonly root = "dist";
    private readonly defaultAnswer = "index.htm";

    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.router.get("/", (req: express.Request, res: express.Response) => {
            res.sendFile(path.join(path.resolve(this.root), this.defaultAnswer));
        });
    }

    get Router(): express.Router {
        return this.router;
    }
}

export default new IndexRouter().Router;
