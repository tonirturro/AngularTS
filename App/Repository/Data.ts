﻿import { Entities } from "../Model/Entities";
import { Page } from "../Model/Page";

/**
 * Class definition for the repository
 */
export class Data {

    private _lastIndex;
    private _entities: Entities;

    /**
     * Initializes a new instance of the Data class
     */
    constructor() {
        this._entities = new Entities();
        this._entities.pages = [];
        this._lastIndex = 0;
        this.newPage();
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

    deletePage(idToDelete: number): boolean {
        var indexToDelete = -1;

        for (var i = 0; i < this._entities.pages.length; i++) {
            if (this._entities.pages[i].id = idToDelete)
            {
                indexToDelete = i;
                break;
            }
        }

        if (indexToDelete >= 0) {
            this._entities.pages.slice(indexToDelete, 1);
            return true;
        } else {
            return false;
        }
    }
}