import * as express from "express";
import { Data } from "../Repository/Data";

/**
 * Report success in REST API
 */
interface IRESTResult {
    success: boolean;
}

/**
 * Handles the routes to the REST api
 */
export class RestRouter {

    /**
     * Field supported for update
     */
    private readonly PageSize = "pageSize";
    private readonly PrintQuality = "printQuality";
    private readonly MediaType = "mediaType";
    private readonly Destination = "destination";

    /**
     * The REST api router
     */
    private router: express.Router;

    /**
     * The data layer
     */
    private data: Data;

    /**
     * Initializes a new instance of the RestRouter class.
     */
    constructor(data: Data) {
        this.data = data;
        this.router = express.Router();

        // Access to the pages repository
        this.router.get("/pages", (req: express.Request, res: express.Response) => {
            res.json(this.data.getPages());
        });

        // Access to the devices repository
        this.router.get("/devices", (req: express.Request, res: express.Response) => {
            res.json(this.data.getDevices());
        });

        // Add new page
        this.router.post("/pages/:deviceId", (req: express.Request, res: express.Response) => {
            const selectedDeviceId = parseInt(req.params.deviceId, 10);
            this.data.newPage(selectedDeviceId);
            res.json({ success: true });
        });

        // Add new device
        this.router.put("/devices", (req: express.Request, res: express.Response) => {
            this.data.newDevice();
            res.json({ success: true });
        });

        // Delete a pagedeviceId
        this.router.delete("/pages/:pageId", (req: express.Request, res: express.Response) => {
            const pageIdToDelete = parseInt(req.params.pageId, 10);
            const result = this.data.deletePage(pageIdToDelete);
            res.json({
                deletedPageId: pageIdToDelete,
                success: result
            });
        });

        // Delete a device
        this.router.delete("/devices/:deviceId", (req: express.Request, res: express.Response) => {
            const deviceIdToDelete = parseInt(req.params.deviceId, 10);
            const result = this.data.deleteDevice(deviceIdToDelete);
            res.json({
                deletedDeviceId: deviceIdToDelete,
                success: result
            });
        });

        // Update page sizes
        this.defineUpdateApi(this.PageSize);

        // Update print quality
        this.defineUpdateApi(this.PrintQuality);

        // Update media type
        this.defineUpdateApi(this.MediaType);

        // Update destination
        this.defineUpdateApi(this.Destination);
    }

    /**
     * Retrieves to router
     */
    get Router(): express.Router {
        return this.router;
    }

    /**
     * Defines the REST Api for field update
     * @param field the field tab to be updated
     */
    private defineUpdateApi(field: string) {
        this.router.put(`/pages/${field}`, (req: express.Request, res: express.Response) => {
            const result = this.processUpdate(field, req);
            res.json(result);
        });
    }

    /**
     * Calls the corresonding update function with the right parameters
     * @param updateFunction is the tag for the update function to be used
     * @param req is the REST request
     */
    private processUpdate(updateFunction: string, req: express.Request): IRESTResult {
        let result = true;
        const pages = req.body.pages;

        if (pages) {
            const newValue = req.body.newValue;
            pages.forEach((page) => {
                    switch (updateFunction) {
                        case this.PageSize:
                            result = result && this.data.updatePageSize(page, newValue);
                            break;
                        case this.PrintQuality:
                            result = result && this.data.updatePrintQuality(page, newValue);
                            break;
                        case this.MediaType:
                            result = result && this.data.updateMediaType(page, newValue);
                            break;
                        case this.Destination:
                            result = result && this.data.updateDestination(page, newValue);
                            break;
                    }
                });
        } else {
            result = false;
        }

        return { success: result };
    }
}
