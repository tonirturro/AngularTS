import { IComponentController } from "angular";
import { PageFields } from "../../../../common/model";
import { ISelectableOption } from "../../../../common/rest";
import { AppService } from "../../Services/AppService";
import { DataService } from "../../Services/DataService";

export interface IVisualPage {
    id: number;
    deviceId: number;
    class: string;
    pageSize: string;
    printQuality: string;
    mediaType: string;
    destination: string;
}

/**
 * Handles the bindings inside the component
 */
export class PageGridController implements IComponentController {

    /**
     * Define dependencies
     */
    public static $inject = ["appService", "dataService"];

    // The pages displayed at the grid
    private pages: IVisualPage[] = [];
    private pageSizeOptions: ISelectableOption[] = [];
    private printQualityOptions: ISelectableOption[] = [];
    private mediaTypeOptions: ISelectableOption[] = [];
    private destinationOptions: ISelectableOption[] = [];


    // The pages elected at the grid
    private selectedPages: number[] = [];

    /**
     * Initializes a new instance of the PageGridController class.
     * @param logService is the Angular log service
     * @param appService the bussiness rules for this application
     * @param dataService the connection to the backend service
     */
    constructor(
        private appService: AppService,
        private dataService: DataService) {
    }

    public $onInit() {
        this.dataService.getPages().then((pages) => {
            this.pages = pages;
        });
        this.dataService.getCapabilities(PageFields.PageSize).then((options) => {
            this.pageSizeOptions = options;
        });
        this.dataService.getCapabilities(PageFields.PrintQuality).then((options) => {
            this.printQualityOptions = options;
        });
        this.dataService.getCapabilities(PageFields.MediaType).then((options) => {
            this.mediaTypeOptions = options;
        });
        this.dataService.getCapabilities(PageFields.Destination).then((options) => {
            this.destinationOptions = options;
        });
    }

    /**
     * Get the available page options
     */
    public get PageSizeOptions(): ISelectableOption[] {
        return this.pageSizeOptions;
    }

    /**
     * Get the available print quality options
     */
    public get PrintQualityOptions(): ISelectableOption[] {
        return this.printQualityOptions;
    }

    /**
     * Get the available madia type options
     */
    public get MediaTypeOptions(): ISelectableOption[] {
        return this.mediaTypeOptions;
    }

    /**
     * Get the available destination options
     */
    public get DestinationOptions(): ISelectableOption[] {
        return this.destinationOptions;
    }

    /**
     * Gets the available pages
     */
    public get Pages(): IVisualPage[] {
        return this.pages;
    }

    /**
     * Gets the selected pages for testing purposes
     */
    public get SelectedPages(): number[] {
        return this.selectedPages;
    }

    /**
     * Sets the selected pages for testing purposes
     */
    public set SelectedPages(selectedPages: number[]) {
        this.selectedPages = selectedPages.slice();
    }

    /**
     * Returns the selected device id
     */
    public get selectedDeviceId(): number {
        return this.appService.SelectedDeviceId;
    }

    public checkFilterOptions(value: IVisualPage): boolean {
        return value.deviceId === 1;
    }

    /**
     * Request a new page
     */
    public addPage(): void {
        if (this.appService.SelectedDeviceId >= 0) {
            this.dataService.addNewPage(this.appService.SelectedDeviceId).then((success) => {
                this.updatePages(success);
            });
        }
    }

    /**
     * Request a page deletion
     * @param pageTodelete is the page id to be deletd
     */
    public deletePage(pageTodelete: number): void {
        this.dataService.deletePage(pageTodelete).then((success) => {
            this.updatePages(success);
        });
    }

    /**
     * Request a page size update
     * @param newValue is the new page size value
     */
    public updatePageSize(newValue: number): void {
        if (this.selectedPages.length > 0) {
            this.dataService.updatePageSize(this.selectedPages, newValue).then((success) => {
                this.updatePages(success);
            });
        }
    }

    /**
     * Request a print quality update
     * @param newValue is the new print quality value
     */
    public updatePrintQuality(newValue: number): void {
        if (this.selectedPages.length > 0) {
            this.dataService.updatePrintQuality(this.selectedPages, newValue).then((success) => {
                this.updatePages(success);
            });
        }
    }

    /**
     * Request a media type update
     * @param newValue is the new media type value
     */
    public updateMediaType(newValue: number): void {
        if (this.selectedPages.length > 0) {
            this.dataService.updateMediaType(this.selectedPages, newValue).then((success) => {
                this.updatePages(success);
            });
        }
    }

    /**
     * Request a destination update
     * @param newValue is the new media type destination value
     */
    public updateDestination(newValue: number): void {
        if (this.selectedPages.length > 0) {
            this.dataService.updateDestination(this.selectedPages, newValue).then((success) => {
                this.updatePages(success);
            });
        }
    }

    /**
     * Page selection
     * @param event is the event generating the click
     * @param page is the selected page
     */
    public selectPage(event: MouseEvent, selectedPage: IVisualPage): void {
        // ignore click on selector
        if (event.srcElement.id === "option") {
            return;
        }

        // Do dot break multiselection if clicked on control
        const isSelector = event.srcElement.attributes.getNamedItem("ng-model");
        const isButton = event.srcElement.attributes.getNamedItem("ng-click");
        if (isSelector || isButton) {
            if (this.selectedPages.indexOf(selectedPage.id) < 0) {
                if (this.selectedPages.length > 1) {
                    this.selectedPages.push(selectedPage.id);
                } else {
                    this.selectedPages = [selectedPage.id];
                }

                this.displaySelection();
            }

            return;
        }

        // Set selection
        // tslint:disable-next-line:prefer-const
        let isMultiSelection = event.ctrlKey;
        if (isMultiSelection) {
            const indexOfSelectedPage = this.selectedPages.indexOf(selectedPage.id);
            if (indexOfSelectedPage < 0) {
                this.selectedPages.push(selectedPage.id);
            } else {
                this.selectedPages.splice(indexOfSelectedPage, 1);
            }
        } else {
            this.selectedPages = [selectedPage.id];
        }

        // Show selection styles
        this.displaySelection();
    }

    /**
     * Updates the pages with the new values
     * @param success if we need to update
     */
    private updatePages(success: boolean): void {
        if (success) {
            this.dataService.getPages().then((pages) => {
                this.pages = pages;
                this.displaySelection();
            });
        }
    }

    /**
     * Displays the visual selection
     */
    private displaySelection(): void {
        // Set selected style
        this.pages.forEach((page) => {
            if (this.selectedPages.indexOf(page.id) < 0) {
                page.class = "";
            } else {
                page.class = "item-selected";
            }
        });
    }
}
