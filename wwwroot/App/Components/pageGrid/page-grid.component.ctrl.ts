import * as angular from "angular";
import { Page } from "../../Model/Page";
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
     * @param promiseService is the service to generate promises
     * @param logService is the Angular log service
     * @param dataService is the connection to the backend service
     */
    constructor(
        private logService: angular.ILogService,
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
     * Request a new page
     */
    addPage(): void {
        this.dataService.addNewPage().then(success => {
            this.updatePages(success);
        });
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
     * @param pageToUpdate is the page id to be updated
     * @param newValue is the new page size value
     */
    updatePageSize(pageToUpdate: number, newValue: number):void {
        this.dataService.updatePageSize([pageToUpdate], newValue).then(success => {
            this.updatePages(success);
        });
    }

    /**
     * Page selection
     * @param event is the event generating the click
     * @param page is the selected page
     */
    selectPage(event: MouseEvent, selectedPage: Page): void
    {
        // Discard selection from action controls
        var isSelector = event.srcElement.attributes.getNamedItem("ng-model");
        var isButton = event.srcElement.attributes.getNamedItem("ng-click");
        if (isSelector || isButton) {
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
