import { Entities } from "../Model/Entities";
import { Page } from "../Model/Page";

/**
 * Class definition for the repository
 */
export class Data {

    private _entities: Entities;

    /**
     * Initializes a new instance of the Data class
     */
    constructor() {
        this._entities = new Entities();
        this._entities.pages = [];
        this._entities.pages.push(new Page(1, 1, 1, 0, 0));
        this._entities.pages.push(new Page(2, 1, 1, 1, 1));
    }

    /**
     * Gets the available pages
     */
    getPages(): Page[]
    {
        return this._entities.pages;
    }
}