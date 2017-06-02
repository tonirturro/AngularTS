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
        let pageToUpdate:Page = null;
        var pageFound = this._entities.pages.some(page => {
            if (page.id === pageId) {
                pageToUpdate = page;
                return true;
            }

            return false;
        });

        if (pageFound) {
            pageToUpdate.pageSize = newValue;
        }

        return pageFound;
    }
}