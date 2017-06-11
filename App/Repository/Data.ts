import { Entities } from "../Model/Entities";
import { Page } from "../Model/Page";

/**
 * Class definition for the repository
 */
export class Data {

    // Track page index
    private _lastIndex;

    // Reference to the data entities from this repository.
    private _entities: Entities;

    /**
     * Initializes a new instance of the Data class
     */
    constructor() {
        this._entities = new Entities();
        this._entities.pages = [];
        this._lastIndex = 0;
    }

    /**
     * Gets the available pages
     */
    getPages(): Page[] {
        return this._entities.pages;
    }

    /**
     * Adds new page
     */
    newPage(): void {
        this._entities.pages.push(new Page(this._lastIndex++, 0, 0, 0, 0));
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