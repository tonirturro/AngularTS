import * as angular from "angular";
import { IQService, IRootScopeService } from "angular";
import { IVisualPage, PageGridController } from "./page-grid.component.ctrl";

import { AppService } from "../../Services/AppService";
import { DataService } from "../../Services/DataService";

import { ISelectableOption } from "../../../../common/rest";

describe("Page grid controller", () => {
    let getCapabilitiesSpy: jasmine.Spy;

    /**
     * Constants
     */
    const ExpectedDeviceId = 1;
    const InitialPages: IVisualPage[] = [
        { id: 0, deviceId: 1 } as IVisualPage,
        { id: 1, deviceId: 1 } as IVisualPage,
        { id: 2, deviceId: 1 } as IVisualPage
    ];
    const InitialPageOptions: ISelectableOption[] = [
        { value: "0", label: "label0" }
    ];
    const InitialQualityOptions: ISelectableOption[] = [
        { value: "0", label: "label0" },
        { value: "1", label: "label1" }
    ];
    const InitialMediaOptions: ISelectableOption[] = [
        { value: "0", label: "label0" },
        { value: "1", label: "label1" },
        { value: "2", label: "label2" }
    ];
    const InitialDestinationOptions: ISelectableOption[] = [
        { value: "0", label: "label0" },
        { value: "1", label: "label1" },
        { value: "2", label: "label2" },
        { value: "3", label: "label3" }
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
     * Initialize the test environment
     */
    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, $q, $rootScope, appService, dataService) => {
        appServiceToMock = appService;
        dataServiceToMock = dataService;
        promiseService = $q;
        rootScopeService = $rootScope;
        getPagesMock = spyOn(dataServiceToMock, "getPages").and.returnValue(promiseService.resolve(InitialPages));
        getCapabilitiesSpy = spyOn(dataServiceToMock, "getCapabilities");
        controller = $componentController("pageGrid");
        appServiceToMock.SelectedDeviceId = 0;
    }));

    /**
     *
     *  The test cases
     *
     */
    it("Has pages when initialized", () => {
        getCapabilitiesSpy.and.returnValue(promiseService.resolve(InitialQualityOptions));
        controller.$onInit();
        rootScopeService.$apply();

        expect(controller.Pages.length).toBe(InitialPages.length);
    });

    it("Has not selected pages when initialized", () => {
        expect(controller.SelectedPages.length).toBe(0);
    });

    it("Has page size options when initialized", () => {
        getCapabilitiesSpy.and.returnValue(promiseService.resolve(InitialPageOptions));
        controller.$onInit();
        rootScopeService.$apply();

        expect(controller.PageSizeOptions).toEqual(InitialPageOptions);
    });

    it("Has quality options when initialized", () => {
        getCapabilitiesSpy.and.returnValue(promiseService.resolve(InitialQualityOptions));
        controller.$onInit();
        rootScopeService.$apply();

        expect(controller.PrintQualityOptions).toEqual(InitialQualityOptions);
    });

    it("Has media options when initialized", () => {
        getCapabilitiesSpy.and.returnValue(promiseService.resolve(InitialMediaOptions));
        controller.$onInit();
        rootScopeService.$apply();

        expect(controller.MediaTypeOptions).toEqual(InitialMediaOptions);
    });

    it("Has destination options when initialized", () => {
        getCapabilitiesSpy.and.returnValue(promiseService.resolve(InitialDestinationOptions));
        controller.$onInit();
        rootScopeService.$apply();

        expect(controller.DestinationOptions).toEqual(InitialDestinationOptions);
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

        expect(dataServiceToMock.getPages).toHaveBeenCalled();
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
