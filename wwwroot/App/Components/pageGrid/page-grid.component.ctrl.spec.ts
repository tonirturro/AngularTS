import * as angular from "angular";
import "angular-mocks";
import { PageGridController } from "./page-grid.component.ctrl";
import { AppService } from "../../Services/AppService";
import { DataService } from "../../Services/DataService";
import { Page } from "../../Model/Page";

describe("Page grid controller", () => {

    /**
     * Constants
     */
    const ExpectedDeviceId = 1;

    /**
     * Common test resources
     */
    let controller: PageGridController;
    let appServiceToMock: AppService;
    let dataServiceToMock: DataService;
    let promiseService: angular.IQService;
    let deferredGetPages: angular.IDeferred<Page[]>;
    let deferredUpdate: angular.IDeferred<boolean>;
    let rootScopeService: angular.IRootScopeService;

    /**
     * Simulates a mouse click
     * @param srcElementId is the element where the click comes from
     * @param attribute is the attribute we want to test
     * @param ctrlPressed if the crtl key is pressed while clicking
     */
    var getClick = (srcElementId: string, attribute: string, ctrlPressed: boolean):MouseEvent => {
        var click = {
            altKey: false,
            button: 0,
            buttons: 0,
            clientX: 0,
            clientY: 0,
            ctrlKey: ctrlPressed,
            fromElement: null,
            layerX: 0,
            layerY: 0,
            metaKey:false,
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
            timeStamp:null,
            type:null,
            scoped:null,
            initEvent:null,
            preventDefault:null,
            stopImmediatePropagation:null,
            stopPropagation:null,
            deepPath:null,
            AT_TARGET:null,
            BUBBLING_PHASE:null,
            CAPTURING_PHASE:null
        };

        click.srcElement.id = srcElementId;
        if (attribute.length > 0) {
            click.srcElement.setAttribute(attribute, "expression");
        }

        return click;
    }

    /**
     * Sets the deferred execution for any update operationm
     */
    var getUpdatePromise = ():angular.IPromise<boolean> => {
        deferredUpdate = promiseService.defer();
        return deferredUpdate.promise;
    }

    /**
     * Executes the deferred update
     * @param pagesReported are the pages reported when the update is executed
     */
    var executeUpdateAndReturnPages = (pagesReported:Page[]) => {
        deferredUpdate.resolve(true);
        deferredGetPages.resolve(pagesReported);
        rootScopeService.$apply();

        expect(dataServiceToMock.getPages).toHaveBeenCalledTimes(2); // one is the initial call at the constructor
        expect(controller.pages.length).toEqual(pagesReported.length);
    }

    /**
     * Initialize the test environment
     */
    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, $q, $rootScope, appService, dataService) => {
        appServiceToMock = appService;
        dataServiceToMock = dataService;
        promiseService = $q;
        rootScopeService = $rootScope;
        deferredGetPages = promiseService.defer();
        spyOn(dataServiceToMock, "getPages").and.returnValue(deferredGetPages.promise);
        controller = $componentController("pageGrid");
        appServiceToMock.selectedDeviceId = 0;
    }));

    /**
     * 
     *  The test cases
     * 
     */
    it("Has pages when initialized", () => {
        expect(controller.pages.length).toBe(0);
    });

    it("Returns the selected device id", () => {
        appServiceToMock.selectedDeviceId = ExpectedDeviceId;

        expect(controller.selectedDeviceId).toBe(ExpectedDeviceId);
    });

    it("Can add pages", () => {
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(getUpdatePromise());

        controller.addPage();

        expect(dataServiceToMock.addNewPage).toHaveBeenCalledTimes(1);
    });

    it("The page is added to the selected device Id", () => {
        appServiceToMock.selectedDeviceId = ExpectedDeviceId;
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(getUpdatePromise());
        
        controller.addPage();
        
        expect(dataServiceToMock.addNewPage).toHaveBeenCalledWith(ExpectedDeviceId);
    });

    it("Add pages refresh page list", () => {
        const ExpectedPageID = 10;
        const pagesAfterAdd = [ new Page(ExpectedPageID, ExpectedDeviceId, "0", "0", "0", "0")];
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(getUpdatePromise());

        controller.addPage();

        executeUpdateAndReturnPages(pagesAfterAdd);
        expect(controller.pages[0].id).toEqual(ExpectedPageID);
    });

    it("Can delete pages", () => {
        const idTodelete = 5;
        spyOn(dataServiceToMock, "deletePage").and.returnValue(getUpdatePromise());

        controller.deletePage(idTodelete);

        expect(dataServiceToMock.deletePage).toHaveBeenCalledWith(idTodelete);
    });

    it("Delete page refresh page list", () => {
        spyOn(dataServiceToMock, "deletePage").and.returnValue(getUpdatePromise());

        controller.deletePage(0);

        executeUpdateAndReturnPages([]);
    });

    it("Can select pages", () => {
        const ExpectedSelectedPageId = 5;
        var click = getClick("", "", false);
        var clickedPage = new Page(ExpectedSelectedPageId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = [];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(1);
        expect(controller.selectedPages[0]).toEqual(ExpectedSelectedPageId);
    });

    it("Click on option does not alter selection", () => {
        var click = getClick("option", "", false);
        var clickedPage = new Page(0, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = [];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(0);
    });

    it("Click changes selection", () => {
        const currentSelectedId = 5;
        const newSelectedId = 10;
        var click = getClick("", "", false);
        var clickedPage = new Page(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(1);
        expect(controller.selectedPages[0]).toEqual(newSelectedId);
    });

    it("Click on option selector changes selection if only one item selected", () => {
        const currentSelectedId = 6;
        const newSelectedId = 11;
        var click = getClick("", "ng-model", false);
        var clickedPage = new Page(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(1);
        expect(controller.selectedPages[0]).toEqual(newSelectedId);
    });

    it("Click on option selector does not change selection if clicked on selected", () => {
        const currentSelectedId = 6;
        var click = getClick("", "ng-model", false);
        var clickedPage = new Page(currentSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(1);
        expect(controller.selectedPages[0]).toEqual(currentSelectedId);
    });

    it("Click on option selector adds to selection if more than one item selected", () => {
        const currentSelectedId1 = 7;
        const currentSelectedId2 = 8;
        const currentSelection = [currentSelectedId1, currentSelectedId2];
        const newSelectedId = 11;
        var click = getClick("", "ng-model", false);
        var clickedPage = new Page(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = currentSelection;

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(currentSelection.length + 1);
        currentSelection.forEach(selection => {
            expect(controller.selectedPages).toContain(selection);
        });
        expect(controller.selectedPages).toContain(newSelectedId);
    });

    it("Click on button changes selection if only one item selected", () => {
        const currentSelectedId = 9;
        const newSelectedId = 15;
        var click = getClick("","ng-click", false);
        var clickedPage = new Page(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(1);
        expect(controller.selectedPages[0]).toEqual(newSelectedId);
    });

    it("Click on button does not change selection if clicked on item selected", () => {
        const currentSelectedId = 9;
        var click = getClick("","ng-click", false);
        var clickedPage = new Page(currentSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(1);
        expect(controller.selectedPages[0]).toEqual(currentSelectedId);
    });

    it("Click on button adds to selection if more than one item selected", () => {
        const currentSelectedId1 = 10;
        const currentSelectedId2 = 11;
        const currentSelection = [currentSelectedId1, currentSelectedId2];
        const newSelectedId = 20;
        var click = getClick("", "ng-click", false);
        var clickedPage = new Page(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = currentSelection;

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(currentSelection.length + 1);
        currentSelection.forEach(selection => {
            expect(controller.selectedPages).toContain(selection);
        });
       expect(controller.selectedPages).toContain(newSelectedId);
    });

    it("Click and crtl key pressed adds new item to selection", () => {
        const currentSelectedId1 = 20;
        const currentSelectedId2 = 21;
        const currentSelection = [currentSelectedId1, currentSelectedId2];
        const newSelectedId = 30;
        var click = getClick("", "", true);
        var clickedPage = new Page(newSelectedId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = currentSelection;

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(currentSelection.length + 1);
        currentSelection.forEach(selection => {
            expect(controller.selectedPages).toContain(selection);
        });
        expect(controller.selectedPages).toContain(newSelectedId);
    });

    it("Click and crtl key pressed deletes item from selection if already selected", () => {
        const currentSelectedId = 20;
        const clickedPageId = 21;
        const currentSelection = [currentSelectedId, clickedPageId];
        var click = getClick("", "", true);
        var clickedPage = new Page(clickedPageId, ExpectedDeviceId, "0", "0", "0", "0");
        controller.selectedPages = currentSelection;

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(currentSelection.length - 1);
        currentSelection.forEach(selection => {
            if (selection !=clickedPageId ) {
                expect(controller.selectedPages).toContain(selection);
            }       
        });
    });

    it("Can update page size", () => {
        const idToUpdate = 2;
        const newPageSize = 0;

        spyOn(dataServiceToMock, "updatePageSize").and.returnValue(getUpdatePromise());

        controller.selectedPages = [idToUpdate];
        controller.updatePageSize(newPageSize);

        expect(dataServiceToMock.updatePageSize).toHaveBeenCalledWith([idToUpdate], newPageSize);
    });

    it("Update page size refresh page list", () => {
        const idToUpdate = 2;
        const newPageSize = 2;
        const pagesReported = [ new Page(idToUpdate, ExpectedDeviceId, newPageSize.toString(), "0", "0", "0")];
        spyOn(dataServiceToMock, "updatePageSize").and.returnValue(getUpdatePromise());

        controller.selectedPages = [idToUpdate];
        controller.updatePageSize(newPageSize);
        
        executeUpdateAndReturnPages(pagesReported);
        expect(controller.pages[0].pageSize).toEqual(newPageSize.toString());
    });

     it("Can update print quality", () => {
        const idToUpdate = 3;
        const newPrintQuality = 0;

        spyOn(dataServiceToMock, "updatePrintQuality").and.returnValue(getUpdatePromise());

        controller.selectedPages = [idToUpdate];
        controller.updatePrintQuality(newPrintQuality);

        expect(dataServiceToMock.updatePrintQuality).toHaveBeenCalledWith([idToUpdate], newPrintQuality);
    });

    it("Update print quality refresh page list", () => {
        const idToUpdate = 3;
        const newPrintQuality = 1;
        const pagesReported = [ new Page(idToUpdate, ExpectedDeviceId, "0", newPrintQuality.toString(), "0", "0")];
        spyOn(dataServiceToMock, "updatePrintQuality").and.returnValue(getUpdatePromise());

        controller.selectedPages = [idToUpdate];
        controller.updatePrintQuality(newPrintQuality);
 
        executeUpdateAndReturnPages(pagesReported);
        expect(controller.pages[0].printQuality).toEqual(newPrintQuality.toString());
    });

    it("Can update media type", () => {
        const idToUpdate = 6;
        const newMediaType = 2;

        spyOn(dataServiceToMock, "updateMediaType").and.returnValue(getUpdatePromise());

        controller.selectedPages = [idToUpdate];
        controller.updateMediaType(newMediaType);

        expect(dataServiceToMock.updateMediaType).toHaveBeenCalledWith([idToUpdate], newMediaType);
    });

    it("Update media type refresh page list", () => {
        const idToUpdate = 3;
        const newMediaType = 1;
        const pagesReported = [ new Page(idToUpdate, ExpectedDeviceId, "0", "0", newMediaType.toString(), "0")];
        spyOn(dataServiceToMock, "updateMediaType").and.returnValue(getUpdatePromise());

        controller.selectedPages = [idToUpdate];
        controller.updateMediaType(newMediaType);
 
        executeUpdateAndReturnPages(pagesReported);
        expect(controller.pages[0].mediaType).toEqual(newMediaType.toString());
    });

    it("Can update destination", () => {
        const idToUpdate = 10;
        const newDestination = 0;

        spyOn(dataServiceToMock, "updateDestination").and.returnValue(getUpdatePromise());

        controller.selectedPages = [idToUpdate];
        controller.updateDestination(newDestination);

        expect(dataServiceToMock.updateDestination).toHaveBeenCalledWith([idToUpdate], newDestination);
    });

    it("Update destination refresh page list", () => {
        const idToUpdate = 5;
        const newDestination = 1;
        const pagesReported = [ new Page(idToUpdate, ExpectedDeviceId, "0", "0", "0", newDestination.toString())];
        spyOn(dataServiceToMock, "updateDestination").and.returnValue(getUpdatePromise());

        controller.selectedPages = [idToUpdate];
        controller.updateDestination(newDestination);
 
        executeUpdateAndReturnPages(pagesReported);
        expect(controller.pages[0].destination).toEqual(newDestination.toString());
    });
});
