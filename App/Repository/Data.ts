import { Entities } from "../Model/Entities";
import { Page } from "../Model/Page";
import { Device } from "../Model/Device";

/**
 * Class definition for the repository
 */
export class Data {

    // Track page index
    private _lastPageIndex;

    // Track device index
    private _lastDeviceIndex;

    // Reference to the data entities from this repository.
    private _entities: Entities;

    /**
     * Initializes a new instance of the Data class
     */
    constructor() {
        this._entities = new Entities();
        this._entities.pages = [];
        this._entities.devices = [];
        this._lastPageIndex = 0;
        this._lastDeviceIndex = 0;
    }

    /**
     * Gets the available pages
     */
    getPages(): Page[] {
        return this._entities.pages;
    }

    /**
     * Gets the available devices
     */
    getDevices(): Device[] {
        return this._entities.devices;
    }

    /**
     * Adds new page
     */
    newPage(deviceId:number): void {
        this._entities.pages.push(new Page(this._lastPageIndex++, deviceId, 0, 0, 0, 0));
    }

    /**
     * Adds a new device
     */
    newDevice(): void {
        var deviceId = this._lastDeviceIndex++;
        this._entities.devices.push(new Device(deviceId, `Device ${this._lastDeviceIndex}`));
    }

    /**
     * Deletes an existing page
     * @param idToDelete is the id for the page to be deleted.
     */
    deletePage(idToDelete: number): boolean {
        var indexToDelete = -1;

        for (var i = 0; i < this._entities.pages.length; i++) {
            if (this._entities.pages[i].id == idToDelete)
            {
                indexToDelete = i;
                break;
            }
        }

        if (indexToDelete >= 0) {
            this._entities.pages.splice(indexToDelete, 1);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Deletes an existing device
     * @param idToDelete is the id for the device to be deleted.
     */
    deleteDevice(idToDelete: number): boolean {
        var indexToDelete = -1;
        
        for (var i = 0; i < this._entities.devices.length; i++) {
            if (this._entities.devices[i].id === idToDelete)
            {
                indexToDelete = i;
                break;
            }
        }

        if (indexToDelete >= 0) {
            // Delete the pages
            var originalPages = this._entities.pages.slice();
            originalPages.forEach(page => {
                if (page.deviceId === idToDelete) {
                    this.deletePage(page.id);
                }
            });
            // Delete the device
            this._entities.devices.splice(indexToDelete, 1);
            return true;
        } else {
            return false;
        }                
    }

    /**
     * Updates the page size for a page
     * @param pageId is the id for the page to be updated
     * @param newValue is the new page size value
     */
    updatePageSize(pageId: number, newValue: number):boolean {
        var pageToUpdate = this.getPage(pageId);

        if (pageToUpdate!= null) {
            pageToUpdate.pageSize = newValue;
            return true;
        }

        return false;
    }

    /**
     * Updates the print quality for a page
     * @param pageId is the id for the page to be updated
     * @param newValue is the new print quality value
     */
    updatePrintQuality(pageId: number, newValue: number):boolean {
        var pageToUpdate = this.getPage(pageId);

        if (pageToUpdate != null) {
            pageToUpdate.printQuality = newValue;
            return true;
        }
            
        return false;
    }

    /**
     * Updates the media type for a page
     * @param pageId is the id for the page to be updated
     * @param newValue is the new media type value
     */
    updateMediaType(pageId: number, newValue: number):boolean {
        var pageToUpdate = this.getPage(pageId);

        if (pageToUpdate != null) {
            pageToUpdate.mediaType = newValue;
            return true;
        }       
        
        return false;       
    }

    /**
     * Updates the destination for a page
     * @param pageId is the id for the page to be updated
     * @param newValue is the new destination value
     */
    updateDestination(pageId: number, newValue: number):boolean {
        var pageToUpdate = this.getPage(pageId);

        if (pageToUpdate != null) {
            pageToUpdate.destination = newValue;
            return true;
        }       
        
        return false;       
    }

    /**
     * Finds a page from its id
     * @param pageId is the id for the page to be found
     */
    private getPage(pageId: number): Page {
        let pageFound:Page = null;
        this._entities.pages.forEach(page => {
            if (page.id === pageId) {
                 pageFound = page;
            }
        })

        return pageFound;
    }
}