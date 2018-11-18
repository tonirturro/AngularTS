import { IComponentController } from "angular";
import { PageFields } from "../../../../common/model";
import { ISelectableOption } from "../../../../common/rest";

export interface IVisualPage {
    id: number;
    deviceId: number;
    class: string;
    pageSize: string;
    printQuality: string;
    mediaType: string;
    destination: string;
}

export interface IPageSelectionData {
    pageId: number;
    multiselection: boolean;
}

export interface IPageUpdateData {
    field: string;
    newValue: number;
}

export interface IPageDeletionData {
    pageId: number;
}

export interface ICapabilities {
    [index: string]: ISelectableOption[];
}

/**
 * Handles the bindings inside the component
 */
export class PageGridController implements IComponentController {

    /**
     * From Bindings
     */
    public capabilities: ICapabilities = {};
    public selectedDeviceId: number;
    public selectedPages: number[] = [];
    public pages: IVisualPage[] = [];
    public onAddPage: () => void;
    public onSelectedPage: (data: IPageSelectionData) => void;
    public onUpdatePages: (data: IPageUpdateData) => void;
    public onDeletePage: (data: IPageDeletionData) => void;

    /**
     * Detects changes on parameters
     * @param changes the parameters that may change
     */
    public $onChanges(changes: any) {
        if (changes.pages  || changes.selectedPages) {
            this.displaySelection();
        }
    }

    /**
     * Get the available page options
     */
    public get PageSizeOptions(): ISelectableOption[] {
        return this.capabilities[PageFields.PageSize];
    }

    /**
     * Get the available print quality options
     */
    public get PrintQualityOptions(): ISelectableOption[] {
        return this.capabilities[PageFields.PrintQuality];
    }

    /**
     * Get the available madia type options
     */
    public get MediaTypeOptions(): ISelectableOption[] {
        return this.capabilities[PageFields.MediaType];
    }

    /**
     * Get the available destination options
     */
    public get DestinationOptions(): ISelectableOption[] {
        return this.capabilities[PageFields.Destination];
    }

    /**
     * Request a new page
     */
    public addPage(): void {
        this.onAddPage();
    }

    /**
     * Request a page deletion
     * @param pageTodelete is the page id to be deletd
     */
    public deletePage(pageTodelete: number): void {
        this.onDeletePage({ pageId: pageTodelete });
    }

    /**
     * Request a page size update
     * @param newValue is the new page size value
     */
    public updatePageSize(newValue: number): void {
        this.onUpdatePages({ field: PageFields.PageSize, newValue });
    }

    /**
     * Request a print quality update
     * @param newValue is the new print quality value
     */
    public updatePrintQuality(newValue: number): void {
        this.onUpdatePages({ field: PageFields.PrintQuality, newValue });
    }

    /**
     * Request a media type update
     * @param newValue is the new media type value
     */
    public updateMediaType(newValue: number): void {
        this.onUpdatePages({ field: PageFields.MediaType, newValue });
    }

    /**
     * Request a destination update
     * @param newValue is the new media type destination value
     */
    public updateDestination(newValue: number): void {
        this.onUpdatePages({ field: PageFields.Destination, newValue });
    }

    /**
     * Page selection
     * @param event is the event generating the click
     * @param page is the selected page
     */
    public selectPage(event: MouseEvent, selectedPage: IVisualPage): void {
        // Do dot break multiselection if clicked on control
        const isSelector = event.srcElement.attributes.getNamedItem("ng-model");
        const isButton = event.srcElement.attributes.getNamedItem("ng-click");
        if (isSelector || isButton) {
            this.onSelectedPage({ pageId: selectedPage.id, multiselection: true});
            return;
        }

        // Set selection
        const isMultiSelection = event.ctrlKey;
        this.onSelectedPage({ pageId: selectedPage.id, multiselection: isMultiSelection});
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
