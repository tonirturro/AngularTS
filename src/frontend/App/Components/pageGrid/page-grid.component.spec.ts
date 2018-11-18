import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IRootScopeService } from "angular";
import { PageFields } from "../../../../common/model";
import { ISelectableOption } from "../../../../common/rest";
import { ICapabilities, IVisualPage } from "./page-grid.component.ctrl";

describe("Given a page grid component ", () => {
    const SelectedDeviceId = 1;
    let element: IAugmentedJQuery;
    let scope: any;
    let rootScope: IRootScopeService;
    let lastSelectedPage: number;
    let lastDeletedPage: number;
    let pageAdded: boolean;

    const InitialPages: IVisualPage[] = [
        {
            destination: "1", deviceId: SelectedDeviceId, id: 0, mediaType: "1", pageSize: "1", printQuality: "1"
        } as IVisualPage,
        {
            destination: "1", deviceId: SelectedDeviceId, id: 1, mediaType: "1", pageSize: "1", printQuality: "1"
        } as IVisualPage,
        {
            destination: "1", deviceId: SelectedDeviceId, id: 2, mediaType: "1", pageSize: "1", printQuality: "1"
        } as IVisualPage,
    ];
    const Capabilities: ICapabilities = {};
    const PageSizeCapabilities: ISelectableOption[] = [
        { value: "0", label: "page0" },
        { value: "1", label: "page1" }
    ];
    const PrintQualityCapabilities: ISelectableOption[] =  [
        { value: "0", label: "quality0" },
        { value: "1", label: "quality1" }
    ];
    const MediaTypeCapabilities: ISelectableOption[] = [
        { value: "0", label: "media0" },
        { value: "1", label: "media1" }
    ];
    const DestinationCapabilities: ISelectableOption[] = [
        { value: "0", label: "destination0" },
        { value: "1", label: "destination1" }
    ];

    beforeEach(angular.mock.module("myApp"));

    beforeEach(() => {
        Capabilities[PageFields.PageSize] = PageSizeCapabilities;
        Capabilities[PageFields.PrintQuality] = PrintQualityCapabilities;
        Capabilities[PageFields.MediaType] = MediaTypeCapabilities;
        Capabilities[PageFields.Destination] = DestinationCapabilities;
    });

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService) => {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        scope.selectedDeviceID = SelectedDeviceId;
        scope.pages = InitialPages;
        scope.selectedPages = [];
        scope.capabilites = Capabilities;
        scope.selectPage = (pageId: number, multiselection: boolean) => {
            lastSelectedPage = pageId;
        };
        scope.deletePage = (pageId: number) => {
            lastDeletedPage = pageId;
        };
        scope.addPage = () => {
            pageAdded = true;
        };
        element = angular.element(`<page-grid ` +
                                    `capabilities="capabilites" ` +
                                    `pages="pages" ` +
                                    `selected-pages="selectedPages" ` +
                                    `selected-device-id="selectedDeviceID" ` +
                                    `on-add-page="addPage()" ` +
                                    `on-delete-page="deletePage(pageId)"` +
                                    `on-update-pages="updatePageField(field,newValue)" ` +
                                    `on-selected-page="selectPage(pageId,multiselection)" />` );
        element = $compile(element)(scope);
        rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When created Then the component has the pages set by the model", () => {
        expect(element.find("tbody").find("tr").length).toBe(InitialPages.length);
    });

    it("When the selected device id does not match the one from the initiial pages " +
       "Then the component does not display any page", () => {
        scope.selectedDeviceID = SelectedDeviceId + 1;
        rootScope.$apply();

        expect(element.find("tbody").find("tr").length).toBe(0);
    });

    it("When created Then it has not selected pages", () => {
        const pages = element.find("tbody").find("tr");
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < pages.length; index++) {
            expect(pages[index].classList.contains("item-selected")).toBeFalsy();
        }
    });

    it("When clicking on a page Then it is selected", () => {
        lastSelectedPage = -1;
        const selectedItem = 1;
        const page = element.find("tbody").find("tr")[selectedItem];
        page.click();

        expect(lastSelectedPage).toBe(InitialPages[selectedItem].id);
    });

    it("When a page is selected Then it is displayed as selected", () => {
        const SelectedItem = 0;
        const pages = element.find("tbody").find("tr");

        scope.selectedPages = [ InitialPages[SelectedItem].id ];
        rootScope.$apply();

        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < pages.length; index++) {
            if (index === SelectedItem ) {
                expect(pages[index].classList.contains("item-selected")).toBeTruthy();
            } else {
                expect(pages[index].classList.contains("item-selected")).toBeFalsy();
            }
        }
    });

    it("When capabilities are reported Then they are displayed", () => {
        const options = element.find("option");
        let offset = 0;
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.PageSize][0].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.PageSize][1].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.PrintQuality][0].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.PrintQuality][1].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.MediaType][0].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.MediaType][1].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.Destination][0].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.Destination][1].label);
    });

    it("When a page is added Then the adition is reported", () => {
        const addButton = element.find("thead").find("tr").find("button")[0];
        pageAdded = false;

        addButton.click();

        expect(pageAdded).toBeTruthy();
    });

    it("When a page is deleted Then the deletion is reported", () => {
        const selectedPage = 1;
        const deleteButton = element.find("tbody").find("tr").find("button");
        deleteButton[selectedPage].click();

        expect(lastDeletedPage).toBe(InitialPages[selectedPage].id);
    });
});
