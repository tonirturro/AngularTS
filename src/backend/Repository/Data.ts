import { IDevice, IPage } from "../../common/rest";
import { Entities } from "../Model/Entities";

/**
 * Class definition for the repository
 */
export class Data {

    // Track page index
    private lastPageIndex;

    // Track device index
    private lastDeviceIndex;

    // Reference to the data entities from this repository.
    private entities: Entities;

    /**
     * Initializes a new instance of the Data class
     */
    constructor() {
        this.entities = new Entities();
        this.entities.pages = [];
        this.entities.devices = [];
        this.lastPageIndex = 0;
        this.lastDeviceIndex = 0;
    }

    /**
     * Gets the available pages
     */
    public getPages(): IPage[] {
        return this.entities.pages;
    }

    /**
     * Gets the available devices
     */
    public getDevices(): IDevice[] {
        return this.entities.devices;
    }

    /**
     * Adds new page
     */
    public newPage(deviceId: number): void {
        const newPage: IPage = {
            destination: "0",
            deviceId,
            id: this.lastPageIndex++,
            mediaType: "0",
            pageSize: "0",
            printQuality: "0",
        };
        this.entities.pages.push(newPage);
    }

    /**
     * Adds a new device
     */
    public newDevice(): void {
        const newDevice: IDevice = {
            id: this.lastDeviceIndex++,
            name: `Device ${this.lastDeviceIndex}`
        };
        this.entities.devices.push(newDevice);
    }

    /**
     * Deletes an existing page
     * @param idToDelete is the id for the page to be deleted.
     */
    public deletePage(idToDelete: number): boolean {
        let indexToDelete = -1;

        for (let i = 0; i < this.entities.pages.length; i++) {
            if (this.entities.pages[i].id === idToDelete) {
                indexToDelete = i;
                break;
            }
        }

        if (indexToDelete >= 0) {
            this.entities.pages.splice(indexToDelete, 1);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Deletes an existing device
     * @param idToDelete is the id for the device to be deleted.
     */
    public deleteDevice(idToDelete: number): boolean {
        let indexToDelete = -1;

        for (let i = 0; i < this.entities.devices.length; i++) {
            if (this.entities.devices[i].id === idToDelete) {
                indexToDelete = i;
                break;
            }
        }

        if (indexToDelete >= 0) {
            // Delete the pages
            const originalPages = this.entities.pages.slice();
            originalPages.forEach((page) => {
                if (page.deviceId === idToDelete) {
                    this.deletePage(page.id);
                }
            });
            // Delete the device
            this.entities.devices.splice(indexToDelete, 1);
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
    public updatePageSize(pageId: number, newValue: string): boolean {
        const pageToUpdate = this.getPage(pageId);

        if (pageToUpdate != null) {
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
    public updatePrintQuality(pageId: number, newValue: string): boolean {
        const pageToUpdate = this.getPage(pageId);

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
    public updateMediaType(pageId: number, newValue: string): boolean {
        const pageToUpdate = this.getPage(pageId);

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
    public updateDestination(pageId: number, newValue: string): boolean {
        const pageToUpdate = this.getPage(pageId);

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
    private getPage(pageId: number): IPage {
        let pageFound: IPage = null;
        this.entities.pages.forEach((page) => {
            if (page.id === pageId) {
                 pageFound = page;
            }
        });

        return pageFound;
    }
}
