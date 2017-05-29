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
        this._dataService.addNewPage().then(sucess => {
            if (sucess) {
                this._dataService.getPages().then(pages => {
                    this.pages_ = pages;
                });
            }
        });
    }

}
