import * as angular from "angular";
import "angular-mocks";
import { PageGridController } from "./page-grid.component.ctrl";
import { DataService } from "../../Services/DataService";
import { Page } from "../../Model/Page";

describe("Page grid controller", () => {

    let controller: PageGridController;
    let dataServiceToMock: DataService;
    let promiseService: angular.IQService;
    let deferredGetPages: angular.IDeferred<Page[]>;
    let rootScopeService: angular.IRootScopeService;
    let getClick = (srcElementId: string, attribute: string, ctrlPressed: boolean):MouseEvent => {
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

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, $q, $rootScope, dataService) => {
        dataServiceToMock = dataService;
        promiseService = $q;
        rootScopeService = $rootScope;
        deferredGetPages = promiseService.defer();
        spyOn(dataServiceToMock, "getPages").and.returnValue(deferredGetPages.promise);
        controller = $componentController("pageGrid");
    }));

    it("Has pages when initialized", () => {
        expect(controller.pages.length).toBe(0);
    });

    it("Can add pages", () => {
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(promiseService.defer().promise);

        controller.addPage();

        expect(dataServiceToMock.addNewPage).toHaveBeenCalledTimes(1);
    });

    it("Add pages refresh page list", () => {
        const ExpectedPageID = 10;
        const pagesAfterAdd = [ new Page(ExpectedPageID, "0", "0", "0", "0")];
        var deferredAddNewPage = promiseService.defer();
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(deferredAddNewPage.promise);

        controller.addPage();
        deferredAddNewPage.resolve(true);
        deferredGetPages.resolve(pagesAfterAdd);
        rootScopeService.$apply();

        expect(dataServiceToMock.getPages).toHaveBeenCalledTimes(2); // one is the initial call at the constructor
        expect(controller.pages.length).toEqual(pagesAfterAdd.length);
        expect(controller.pages[0].id).toEqual(ExpectedPageID);
    });

    it("Can delete pages", () => {
        const idTodelete = 5;
        spyOn(dataServiceToMock, "deletePage").and.returnValue(promiseService.defer().promise);

        controller.deletePage(idTodelete);

        expect(dataServiceToMock.deletePage).toHaveBeenCalledWith(idTodelete);
    });

    it("Delete page refresh page list", () => {
        var deferredDeletePage = promiseService.defer();
        spyOn(dataServiceToMock, "deletePage").and.returnValue(deferredDeletePage.promise);

        controller.deletePage(0);
        deferredDeletePage.resolve(true);
        deferredGetPages.resolve([]);
        rootScopeService.$apply();

        expect(dataServiceToMock.getPages).toHaveBeenCalledTimes(2); // one is the initial call at the constructor
        expect(controller.pages.length).toEqual(0);
    });

    it("Can select pages", () => {
        const ExpectedSelectedPageId = 5;
        var click = getClick("", "", false);
        var clickedPage = new Page(ExpectedSelectedPageId, "0", "0", "0", "0");
        controller.selectedPages = [];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(1);
        expect(controller.selectedPages[0]).toEqual(ExpectedSelectedPageId);
    });

    it("Click on option does not alter selection", () => {
        var click = getClick("option", "", false);
        var clickedPage = new Page(0, "0", "0", "0", "0");
        controller.selectedPages = [];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(0);
    });

    it("Click changes selection", () => {
        const currentSelectedId = 5;
        const newSelectedId = 10;
        var click = getClick("", "", false);
        var clickedPage = new Page(newSelectedId, "0", "0", "0", "0");
        controller.selectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(1);
        expect(controller.selectedPages[0]).toEqual(newSelectedId);
    });

    it("Click on option selector changes selection if only one item selected", () => {
        const currentSelectedId = 6;
        const newSelectedId = 11;
        var click = getClick("", "ng-model", false);
        var clickedPage = new Page(newSelectedId, "0", "0", "0", "0");
        controller.selectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(1);
        expect(controller.selectedPages[0]).toEqual(newSelectedId);
    });

    it("Click on option selector does not change selection if clicked on selected", () => {
        const currentSelectedId = 6;
        var click = getClick("", "ng-model", false);
        var clickedPage = new Page(currentSelectedId, "0", "0", "0", "0");
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
        var clickedPage = new Page(newSelectedId, "0", "0", "0", "0");
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
        var clickedPage = new Page(newSelectedId, "0", "0", "0", "0");
        controller.selectedPages = [currentSelectedId];

        controller.selectPage(click, clickedPage);

        expect(controller.selectedPages.length).toEqual(1);
        expect(controller.selectedPages[0]).toEqual(newSelectedId);
    });

    it("Click on button does not change selection if clicked on item selected", () => {
        const currentSelectedId = 9;
        var click = getClick("","ng-click", false);
        var clickedPage = new Page(currentSelectedId, "0", "0", "0", "0");
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
        var clickedPage = new Page(newSelectedId, "0", "0", "0", "0");
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
        var clickedPage = new Page(newSelectedId, "0", "0", "0", "0");
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
        var clickedPage = new Page(clickedPageId, "0", "0", "0", "0");
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

        spyOn(dataServiceToMock, "updatePageSize").and.returnValue(promiseService.defer().promise);

        controller.selectedPages = [idToUpdate];
        controller.updatePageSize(newPageSize);

        expect(dataServiceToMock.updatePageSize).toHaveBeenCalledWith([idToUpdate], newPageSize);
    });

    it("Update page size refresh page list", () => {
        const idToUpdate = 2;
        const newPageSize = 2;
        const pagesReported = [ new Page(idToUpdate, newPageSize.toString(), "0", "0", "0")];
        var deferredUpdatePageSize = promiseService.defer();
        spyOn(dataServiceToMock, "updatePageSize").and.returnValue(deferredUpdatePageSize.promise);

        controller.selectedPages = [idToUpdate];
        controller.updatePageSize(newPageSize);
        deferredUpdatePageSize.resolve(true);
        deferredGetPages.resolve(pagesReported);
        rootScopeService.$apply();

        expect(dataServiceToMock.getPages).toHaveBeenCalledTimes(2); // one is the initial call at the constructor
        expect(controller.pages.length).toEqual(pagesReported.length);
        expect(controller.pages[0].pageSize).toEqual(newPageSize.toString());
    });
});
