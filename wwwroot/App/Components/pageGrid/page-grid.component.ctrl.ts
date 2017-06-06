import * as angular from "angular";
import { Page } from "../../Model/Page";
import { DataService } from "../../Services/DataService";

/**
 * Handles the bindings inside the component
 */
export class PageGridController {
    private _dataService: DataService;
    private pages_: Page[];


    /**
     * Initializes a new instance of the PageGridController class.
     * @param logService is the Angular log service
     * @param dataService is the connection to the backend service
     */
    constructor(private logService: angular.ILogService,private dataService: DataService)
    {
        this._dataService = dataService;
        this.pages_ = [];
        this._dataService.getPages().then(pages => {
            this.pages_ = pages;
        });
    }

    /**
    * Gets the available pages
    */
    get pages(): Page[] {
        return this.pages_;
    }

    /**
     * Request a new page
     */
    addPage(): void {
        this._dataService.addNewPage().then(success => {
            this.updatePages(success);
        });
    }

    /**
     * Request a page deletion
     * @param pageTodelete is the page id to be deletd
     */
    deletePage(pageTodelete: number): void {
        this._dataService.deletePage(pageTodelete).then(success => {
            this.updatePages(success);
        });
    }

    /**
     * Request a page size update
     * @param pageToUpdate is the page id to be updated
     * @param newValue is the new page size value
     */
    updatePageSize(pageToUpdate: number, newValue: number):void {
        this._dataService.updatePageSize(pageToUpdate, newValue).then(success => {
            this.updatePages(success);
        });
    }

    /**
     * Updates the pages with the new values
     * @param success if we need to update
     */
    private updatePages(success:boolean):void {
        if (success) {
            this._dataService.getPages().then(pages => {
                this.pages_ = pages;
            });
        }
    }
}
