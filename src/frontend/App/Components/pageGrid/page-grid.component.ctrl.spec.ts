import * as angular from "angular";
import { IQService, IRootScopeService } from "angular";
import { IVisualPage, PageGridController } from "./page-grid.component.ctrl";

import { AppService } from "../../Services/AppService";
import { DataService } from "../../Services/DataService";

import { ISelectableOption } from "../../../../common/rest";

describe("Page grid controller", () => {

    /**
     * Constants
     */
    const ExpectedDeviceId = 1;
    const InitialPages: IVisualPage[] = [];
    const InitialPageOptions: ISelectableOption[] = [
        { value: "0", label: "label0" }
    ];

    /**
     * Common test resources
     */
    let controller: PageGridController;
    let appServiceToMock: AppService;
    let dataServiceToMock: DataService;
    let promiseService: IQService;
    let rootScopeService: IRootScopeService;
    let getPagesMock: jasmine.Spy;
    const getVisualPage = (
        id: number,
        deviceId: number,
        pageSize: string,
        printQuality: string,
        mediaType: string,
        destination: string) => {
        return {  deviceId, id, pageSize, printQuality, mediaType,  class: "",  destination } as IVisualPage;
    };

    /**
     * Simulates a mouse click
     * @param srcElementId is the element where the click comes from
     * @param attribute is the attribute we want to test
     * @param ctrlPressed if the crtl key is pressed while clicking
     */
    const getClick = (srcElementId: string, attribute: string, ctrlPressed: boolean): MouseEvent => {
        const click = {
            altKey: false,
            button: 0,
            buttons: 0,
            clientX: 0,
            clientY: 0,
            ctrlKey: ctrlPressed,
            fromElement: null,
            layerX: 0,
            layerY: 0,
            metaKey: false,
            movementX: 0,
            movementY: 0,
            offsetX: 0,
            offsetY: 0,
            pageX: 0,
            pageY: 0,
            relatedTarget: null,
            screenX: 0,
            screenY: 0,
            shiftKey: false,
            toElement: null,
            which: null,
            x: 0,
            y: 0,
            // tslint:disable-next-line:object-literal-sort-keys
            getModifierState: null,
            initMouseEvent: null,
            detail: 0,
            view: null,
            initUIEvent: null,
            bubbles: false,
            cancelBubble: false,
            cancelable: false,
            currentTarget: null,
            defaultPrevented: null,
            eventPhase: 0,
            isTrusted: false,
            returnValue: false,
            srcElement: document.createElement("tr"),
            target: null,
            timeStamp: null,
            type: null,
            scoped: null,
            initEvent: null,
            preventDefault: null,
            stopImmediatePropagation: null,
            stopPropagation: null,
            deepPath: null,
            AT_TARGET: null,
            BUBBLING_PHASE: null,
            CAPTURING_PHASE: null,
            NONE: 0
        } as MouseEvent;

        click.srcElement.id = srcElementId;
        if (attribute.length > 0) {
            click.srcElement.setAttribute(attribute, "expression");
        }

        return click;
    };

    /**
     * Initialize the test environment
     */
    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, $q, $rootScope, appService, dataService) => {
        appServiceToMock = appService;
        dataServiceToMock = dataService;
        promiseService = $q;
        rootScopeService = $rootScope;
        getPagesMock = spyOn(dataServiceToMock, "getPages").and.returnValue(promiseService.resolve(InitialPages));
        spyOn(dataServiceToMock, "getCapabilities").and.returnValue(promiseService.resolve(InitialPageOptions));
        controller = $componentController("pageGrid");
        appServiceToMock.SelectedDeviceId = 0;
        controller.$onInit();
        rootScopeService.$apply();
    }));

    /**
     *
     *  The test cases
     *
     */
    it("Has pages when initialized", () => {
        expect(controller.Pages.length).toBe(0);
    });

    it("Has page size options when initialized", () => {
        expect(controller.PageSizeOptions).toEqual(InitialPageOptions);
    });

    it("Returns the selected device id", () => {
        appServiceToMock.SelectedDeviceId = ExpectedDeviceId;

        expect(controller.selectedDeviceId).toBe(ExpectedDeviceId);
    });

    it("Can add pages", () => {
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(promiseService.resolve(true));

        controller.addPage();

        expect(dataServiceToMock.addNewPage).toHaveBeenCalledTimes(1);
    });

    it("The page is added to the selected device Id", () => {
        appServiceToMock.SelectedDeviceId = ExpectedDeviceId;
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(promiseService.resolve(true));

        controller.addPage();

        expect(dataServiceToMock.addNewPage).toHaveBeenCalledWith(ExpectedDeviceId);
    });

    it("Add pages refresh page list", () => {
        const ExpectedPageID = 10;
        const pagesAfterAdd = [ getVisualPage(ExpectedPageID, ExpectedDeviceId, "0", "0", "0", "0")];
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(promiseService.resolve(true));
        getPagesMock.and.returnValue(promiseService.resolve(pagesAfterAdd));

        controller.addPage();
        rootScopeService.$apply();

        expect(controller.Pages[0].id).toEqual(ExpectedPageID);
    });

    it("Can delete pages", () => {
        const idTodelete = 5;
        spyOn(dataServiceToMock, "deletePage").and.returnValue(promiseService.resolve(true));

        controller.deletePage(idTodelete);

        expect(dataServiceToMock.deletePage).toHaveBeenCalledWith(idTodelete);
    });

    it("Delete page refresh page list", () => {
        spyOn(dataServiceToMock, "deletePage").and.returnValue(promiseService.resolve(true));

        controller.deletePage(0);
        rootScopeService.$apply();

        expect(dataServiceToMock.getPages).toHaveBeenCalledTimes(2);
    });

    it("Can select pages", () => {
        const ExpectedSelectedPageId = 5;
        const click = getClick("", "", false);
        const clickedPage = getVisualPage(ExpectedSelectedPageId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = [];

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(1);
        expect(controller.SelectedPages[0]).toEqual(ExpectedSelectedPageId);
    });

    it("Click on option does not alter selection", () => {
        const click = getClick("option", "", false);
        const clickedPage = getVisualPage(0, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = [];

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(0);
    });

    it("Click changes selection", () => {
        const currentSelectedId = 5;
        const newSelectedId = 10;
        const click = getClick("", "", false);
        const clickedPage = getVisualPage(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(1);
        expect(controller.SelectedPages[0]).toEqual(newSelectedId);
    });

    it("Click on option selector changes selection if only one item selected", () => {
        const currentSelectedId = 6;
        const newSelectedId = 11;
        const click = getClick("", "ng-model", false);
        const clickedPage = getVisualPage(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(1);
        expect(controller.SelectedPages[0]).toEqual(newSelectedId);
    });

    it("Click on option selector does not change selection if clicked on selected", () => {
        const currentSelectedId = 6;
        const click = getClick("", "ng-model", false);
        const clickedPage = getVisualPage(currentSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(1);
        expect(controller.SelectedPages[0]).toEqual(currentSelectedId);
    });

    it("Click on option selector adds to selection if more than one item selected", () => {
        const currentSelectedId1 = 7;
        const currentSelectedId2 = 8;
        const currentSelection = [currentSelectedId1, currentSelectedId2];
        const newSelectedId = 11;
        const click = getClick("", "ng-model", false);
        const clickedPage = getVisualPage(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = currentSelection;

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(currentSelection.length + 1);
        currentSelection.forEach((selection) => {
            expect(controller.SelectedPages).toContain(selection);
        });
        expect(controller.SelectedPages).toContain(newSelectedId);
    });

    it("Click on button changes selection if only one item selected", () => {
        const currentSelectedId = 9;
        const newSelectedId = 15;
        const click = getClick("", "ng-click", false);
        const clickedPage = getVisualPage(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(1);
        expect(controller.SelectedPages[0]).toEqual(newSelectedId);
    });

    it("Click on button does not change selection if clicked on item selected", () => {
        const currentSelectedId = 9;
        const click = getClick("", "ng-click", false);
        const clickedPage = getVisualPage(currentSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(1);
        expect(controller.SelectedPages[0]).toEqual(currentSelectedId);
    });

    it("Click on button adds to selection if more than one item selected", () => {
        const currentSelectedId1 = 10;
        const currentSelectedId2 = 11;
        const currentSelection = [currentSelectedId1, currentSelectedId2];
        const newSelectedId = 20;
        const click = getClick("", "ng-click", false);
        const clickedPage = getVisualPage(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = currentSelection;

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(currentSelection.length + 1);
        currentSelection.forEach((selection) => {
            expect(controller.SelectedPages).toContain(selection);
        });
        expect(controller.SelectedPages).toContain(newSelectedId);
    });

    it("Click and crtl key pressed adds new item to selection", () => {
        const currentSelectedId1 = 20;
        const currentSelectedId2 = 21;
        const currentSelection = [currentSelectedId1, currentSelectedId2];
        const newSelectedId = 30;
        const click = getClick("", "", true);
        const clickedPage = getVisualPage(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = currentSelection;

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(currentSelection.length + 1);
        currentSelection.forEach((selection) => {
            expect(controller.SelectedPages).toContain(selection);
        });
        expect(controller.SelectedPages).toContain(newSelectedId);
    });

    it("Click and crtl key pressed deletes item from selection if already selected", () => {
        const currentSelectedId = 20;
        const clickedPageId = 21;
        const currentSelection = [currentSelectedId, clickedPageId];
        const click = getClick("", "", true);
        const clickedPage = getVisualPage(clickedPageId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.SelectedPages = currentSelection;

        controller.selectPage(click, clickedPage);

        expect(controller.SelectedPages.length).toEqual(currentSelection.length - 1);
        currentSelection.forEach((selection) => {
            if (selection !== clickedPageId ) {
                expect(controller.SelectedPages).toContain(selection);
            }
        });
    });

    it("Can update page size", () => {
        const idToUpdate = 2;
        const newPageSize = 0;

        spyOn(dataServiceToMock, "updatePageSize").and.returnValue(promiseService.resolve(true));

        controller.SelectedPages = [idToUpdate];
        controller.updatePageSize(newPageSize);

        expect(dataServiceToMock.updatePageSize).toHaveBeenCalledWith([idToUpdate], newPageSize);
    });

    it("Update page size refresh page list", () => {
        const idToUpdate = 2;
        const newPageSize = 2;
        const pagesReported = [ getVisualPage(idToUpdate, ExpectedDeviceId, newPageSize.toString(), "0", "0", "0")];
        spyOn(dataServiceToMock, "updatePageSize").and.returnValue(promiseService.resolve(true));
        getPagesMock.and.returnValue(promiseService.resolve(pagesReported));

        controller.SelectedPages = [idToUpdate];
        controller.updatePageSize(newPageSize);
        rootScopeService.$apply();

        expect(controller.Pages[0].pageSize).toEqual(newPageSize.toString());
    });

    it("Can update print quality", () => {
        const idToUpdate = 3;
        const newPrintQuality = 0;

        spyOn(dataServiceToMock, "updatePrintQuality").and.returnValue(promiseService.resolve(true));

        controller.SelectedPages = [idToUpdate];
        controller.updatePrintQuality(newPrintQuality);

        expect(dataServiceToMock.updatePrintQuality).toHaveBeenCalledWith([idToUpdate], newPrintQuality);
    });

    it("Update print quality refresh page list", () => {
        const idToUpdate = 3;
        const newPrintQuality = 1;
        const pagesReported = [ getVisualPage(idToUpdate, ExpectedDeviceId, "0", newPrintQuality.toString(), "0", "0")];
        spyOn(dataServiceToMock, "updatePrintQuality").and.returnValue(promiseService.resolve(true));
        getPagesMock.and.returnValue(promiseService.resolve(pagesReported));

        controller.SelectedPages = [idToUpdate];
        controller.updatePrintQuality(newPrintQuality);
        rootScopeService.$apply();

        expect(controller.Pages[0].printQuality).toEqual(newPrintQuality.toString());
    });

    it("Can update media type", () => {
        const idToUpdate = 6;
        const newMediaType = 2;

        spyOn(dataServiceToMock, "updateMediaType").and.returnValue(promiseService.resolve(true));

        controller.SelectedPages = [idToUpdate];
        controller.updateMediaType(newMediaType);

        expect(dataServiceToMock.updateMediaType).toHaveBeenCalledWith([idToUpdate], newMediaType);
    });

    it("Update media type refresh page list", () => {
        const idToUpdate = 3;
        const newMediaType = 1;
        const pagesReported = [ getVisualPage(idToUpdate, ExpectedDeviceId, "0", "0", newMediaType.toString(), "0")];
        spyOn(dataServiceToMock, "updateMediaType").and.returnValue(promiseService.resolve(true));
        getPagesMock.and.returnValue(promiseService.resolve(pagesReported));

        controller.SelectedPages = [idToUpdate];
        controller.updateMediaType(newMediaType);
        rootScopeService.$apply();

        expect(controller.Pages[0].mediaType).toEqual(newMediaType.toString());
    });

    it("Can update destination", () => {
        const idToUpdate = 10;
        const newDestination = 0;

        spyOn(dataServiceToMock, "updateDestination").and.returnValue(promiseService.resolve(true));

        controller.SelectedPages = [idToUpdate];
        controller.updateDestination(newDestination);

        expect(dataServiceToMock.updateDestination).toHaveBeenCalledWith([idToUpdate], newDestination);
    });

    it("Update destination refresh page list", () => {
        const idToUpdate = 5;
        const newDestination = 1;
        const pagesReported = [ getVisualPage(idToUpdate, ExpectedDeviceId, "0", "0", "0", newDestination.toString())];
        spyOn(dataServiceToMock, "updateDestination").and.returnValue(promiseService.resolve(true));
        getPagesMock.and.returnValue(promiseService.resolve(pagesReported));

        controller.SelectedPages = [idToUpdate];
        controller.updateDestination(newDestination);
        rootScopeService.$apply();

        expect(controller.Pages[0].destination).toEqual(newDestination.toString());
    });
});
