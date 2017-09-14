import * as express from "express";
import { Data } from "../Repository/Data";

/**
 * Report success in REST API
 */
class RESTResult {
    success: boolean;
    constructor(sucess: boolean) {
        this.success = sucess;
    }
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
    private _router: express.Router;

    /**
     * The data layer
     */
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

        // Access to the devices repository
        this._router.get('/devices', (req: express.Request, res: express.Response) => {
            res.json(this._data.getDevices());
        });
        
        // Add new page
        this._router.post('/pages/:deviceId', (req: express.Request, res: express.Response) => {
            var selectedDeviceId = parseInt(req.params.deviceId);
            this._data.newPage(selectedDeviceId);
            res.json({ success: true });
        });

        // Add new device
        this._router.put('/devices', (req: express.Request, res: express.Response) => {
            this._data.newDevice();
            res.json({ success: true });
        });        

        // Delete a pagedeviceId
        this._router.delete('/pages/:pageId', (req: express.Request, res: express.Response) => {
            var pageIdToDelete = parseInt(req.params.pageId);
            var result = this._data.deletePage(pageIdToDelete);
            res.json({
                deletedPageId: pageIdToDelete,
                success: result
            });
        });

        // Delete a device
        this._router.delete('/devices/:deviceId', (req: express.Request, res: express.Response) => {
            var deviceIdToDelete = parseInt(req.params.deviceId);
            var result = this._data.deleteDevice(deviceIdToDelete);
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
    /* Retrieve the router
    */
    get router(): express.Router {
        return this._router;
    }

    /**
     * Defines the REST Api for field update
     * @param field the field tab to be updated
     */
    private defineUpdateApi(field: string) {
        this._router.put(`/pages/${field}`, (req: express.Request, res: express.Response) => {
            var result = this.processUpdate(field, req);
            res.json(result);
        });
    }

    /**
     * Calls the corresonding update function with the right parameters
     * @param updateFunction is the tag for the update function to be used
     * @param req is the REST request
     */
    private processUpdate(updateFunction:string, req: express.Request):RESTResult {
        var result = true;
        var pages = req.body.pages;

        if (pages) {
            var newValue = req.body.newValue;
            pages.forEach(page => {
                    switch(updateFunction) {
                        case this.PageSize:
                            result = result && this._data.updatePageSize(page, newValue);
                            break;
                        case this.PrintQuality:
                            result = result && this._data.updatePrintQuality(page, newValue);
                            break;
                        case this.MediaType:
                            result = result && this._data.updateMediaType(page, newValue);
                            break;
                        case this.Destination:
                            result = result && this._data.updateDestination(page, newValue);
                            break;
                    }    
                });
        } else {
            result = false;
        }
        
        return new RESTResult(result);
    }
}
