import * as angular from "angular";
import { Page } from "../../Model/Page";
import { AppService } from "../../Services/AppService";
import { DataService } from "../../Services/DataService";

/**
 * Handles the bindings inside the component
 */
export class PageGridController {

    // The pages displayed at the grid
    private pages_: Page[];

    // The pages elected at the grid
    private selectedPages_: number[];

    /**
     * Initializes a new instance of the PageGridController class.
     * @param logService is the Angular log service
     * @param appService the bussiness rules for this application
     * @param dataService the connection to the backend service
     */
    constructor(
        private logService: angular.ILogService,
        private appService: AppService,        
        private dataService: DataService)
    {
        this.pages_ = [];
        this.selectedPages_ = [];
        this.dataService.getPages().then(pages => {
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
     * Gets the selected pages for testing purposes
     */
    get selectedPages():number[] {
        return this.selectedPages_;
    }

    /**
    * Sets the selected pages for testing purposes
    */
    set selectedPages(selectedPages: number[]) {
        this.selectedPages_ = selectedPages.slice();
    }

    /**
     * Returns the selected device id
     */
    get selectedDeviceId():number {
        return this.appService.selectedDeviceId;
    }

    checkFilterOptions(value:Page, index:number):boolean {
        return value.deviceId === 1;
    }

    /**
     * Request a new page
     */
    addPage(): void {
        if (this.appService.selectedDeviceId >= 0) {
            this.dataService.addNewPage(this.appService.selectedDeviceId).then(success => {
                this.updatePages(success);
            });    
        }
    }

    /**
     * Request a page deletion
     * @param pageTodelete is the page id to be deletd
     */
    deletePage(pageTodelete: number): void {
        this.dataService.deletePage(pageTodelete).then(success => {
            this.updatePages(success);
        });
    }

    /**
     * Request a page size update
     * @param newValue is the new page size value
     */
    updatePageSize(newValue: number): void {
        if (this.selectedPages_.length > 0) {
            this.dataService.updatePageSize(this.selectedPages_, newValue).then(success => {
                this.updatePages(success);
            });
        }
    }

    /**
     * Request a print quality update
     * @param newValue is the new print quality value
     */
    updatePrintQuality(newValue: number): void {
        if (this.selectedPages_.length > 0) {
            this.dataService.updatePrintQuality(this.selectedPages_, newValue).then(success => {
                this.updatePages(success);
            });
        }
    }

    /**
     * Request a media type update
     * @param newValue is the new media type value
     */
    updateMediaType(newValue: number): void {
        if (this.selectedPages_.length > 0) {
            this.dataService.updateMediaType(this.selectedPages_, newValue).then(success => {
                this.updatePages(success);
            });
        }
    }

    /**
     * Request a destination update
     * @param newValue is the new media type destination value
     */
    updateDestination(newValue: number): void {
        if (this.selectedPages_.length > 0) {
            this.dataService.updateDestination(this.selectedPages_, newValue).then(success => {
                this.updatePages(success);
            });
        }
    }

    /**
     * Page selection
     * @param event is the event generating the click
     * @param page is the selected page
     */
    selectPage(event: MouseEvent, selectedPage: Page): void
    {
        // ignore click on selector
        if (event.srcElement.id === "option")
        {
            return;
        }

        // Do dot break multiselection if clicked on control
        var isSelector = event.srcElement.attributes.getNamedItem("ng-model");
        var isButton = event.srcElement.attributes.getNamedItem("ng-click");
        if (isSelector || isButton) {
            if (this.selectedPages_.indexOf(selectedPage.id) < 0) {
                if (this.selectedPages_.length > 1) {
                    this.selectedPages_.push(selectedPage.id);
                } else {
                    this.selectedPages_ = [selectedPage.id]
                }

                this.displaySelection();   
            }

            return;
        }

        // Set selection
        var isMultiSelection = event.ctrlKey;
        if (isMultiSelection) {
            var indexOfSelectedPage = this.selectedPages_.indexOf(selectedPage.id);
            if (indexOfSelectedPage < 0) {
                this.selectedPages_.push(selectedPage.id);
            } else {
                this.selectedPages_.splice(indexOfSelectedPage, 1);
            }
        } else {
            this.selectedPages_ = [selectedPage.id];
        }

        // Show selection styles
        this.displaySelection();
    }

    /**
     * Updates the pages with the new values
     * @param success if we need to update
     */
    private updatePages(success:boolean):void {
        if (success) {
            this.dataService.getPages().then(pages => {
                this.pages_ = pages;
                this.displaySelection();
            });
        }
    }

    /**
     * Displays the visual selection
     */
    private displaySelection(): void {
        // Set selected style
        this.pages_.forEach(page => {
            if (this.selectedPages_.indexOf(page.id) < 0) {
                page.class = "";
            } else {
                page.class = "item-selected"
            }
        });
    }  
}
