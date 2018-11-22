import { StateService } from "@uirouter/core";
import * as angular from "angular";
import { IPromise, IQService, IRootScopeService, IWindowService } from "angular";
import { PageFields } from "../../../common/model";
import { ISelectableOption } from "../../../common/rest";
import { DataService } from "../Services/DataService";
import { IDeviceSelection, MainPageController } from "./main-page.component.ctrl";

describe("Given a main page component controller", () => {
    let controller: MainPageController;
    let q: IQService;
    let rootScopeService: IRootScopeService;
    let stateServiceToMock: StateService;
    let dataServiceToMock: DataService;
    let windowServiceToMock: IWindowService;

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

    beforeEach(inject(($componentController, $q, $rootScope, $state: StateService, $window, dataService) => {
        rootScopeService = $rootScope;
        stateServiceToMock = $state;
        windowServiceToMock = $window;
        dataServiceToMock = dataService;
        q = $q;
        spyOn(stateServiceToMock, "go");
        spyOn(dataServiceToMock, "getDevices").and.returnValue(q.resolve([]));
        spyOn(dataServiceToMock, "addNewDevice").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "deleteDevice").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "updatePageField").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "deletePage").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "getCapabilities")
            .and.callFake((capability: string): IPromise<ISelectableOption[]> => {
                switch (capability) {
                    case PageFields.PageSize:
                        return q.resolve(PageSizeCapabilities);
                    case PageFields.PrintQuality:
                        return q.resolve(PrintQualityCapabilities);
                    case PageFields.MediaType:
                        return q.resolve(MediaTypeCapabilities);
                    case PageFields.Destination:
                        return q.resolve(DestinationCapabilities);
                    default:
                        return q.reject("Invalid field");
                }
            });
        controller = $componentController("mainPage");
    }));

    it("When is ititialized Then it gets the existing devices", () => {
        controller.$onInit();

        expect(dataServiceToMock.getDevices).toHaveBeenCalled();
    });

    it("When it is initialized Then it has not selected pages", () => {
        expect(controller.selectedPages.length).toBe(0);
    });

    it("When it is initialized Then it goes to the pages edition", () => {
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };
        controller.$onInit();

        expect(stateServiceToMock.go).toHaveBeenCalledWith("pages", expectedDeviceSelection);
    });

    it("When calling close Then the window sercice is called to close the window", () => {
        spyOn(windowServiceToMock, "close");

        controller.close();

        expect(windowServiceToMock.close).toHaveBeenCalled();
    });

    it("When calling edit devices Then the view changes to the device edition", () => {
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };
        controller.editDevices();

        expect(controller.editingDevices).toBeTruthy();
        expect(stateServiceToMock.go).toHaveBeenCalledWith("device", expectedDeviceSelection);
    });

    it("When calling edit pages Then the view changes to the pages edition", () => {
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };
        controller.editPages();

        expect(controller.editingDevices).toBeFalsy();
        expect(stateServiceToMock.go).toHaveBeenCalledWith("pages", expectedDeviceSelection);
    });

    it("When selecting device Then it is reflected by the associated property", () => {
        const ExpectedDeviceId = 5;
        controller.selectDevice(ExpectedDeviceId);
        expect(controller.selectedDeviceId).toBe(ExpectedDeviceId);
    });

    it("When selecting device Then the view is adjusted with the selected device", () => {
        const ExpectedDeviceId = 8;
        controller.editingDevices = true;
        controller.selectDevice(ExpectedDeviceId);
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };

        expect(stateServiceToMock.go).toHaveBeenCalledWith("device", expectedDeviceSelection);
    });

    it("When adding a device Then the data service is called", () => {
        controller.addDevice();

        expect(dataServiceToMock.addNewDevice).toHaveBeenCalled();
    });

    it("When adding a device Then the devives are reloaded", () => {
        controller.addDevice();
        rootScopeService.$apply();

        expect(dataServiceToMock.getDevices).toHaveBeenCalled();
    });

    it("When deleting a device Then the data service is called", () => {
        const idToDelete = 4;

        controller.deleteDevice(idToDelete);

        expect(dataServiceToMock.deleteDevice).toHaveBeenCalledWith(idToDelete);
    });

    it("When deleting the selected device Then the selection is changed", () => {
        const SelectedDeviceId = 4;
        controller.selectedDeviceId = SelectedDeviceId;

        controller.deleteDevice(SelectedDeviceId);
        rootScopeService.$apply();

        expect(controller.selectedDeviceId).not.toEqual(SelectedDeviceId);
    });

    it("When deleting a device Then the device list is updated", () => {
        controller.deleteDevice(0);
        rootScopeService.$apply();

        expect(dataServiceToMock.getDevices).toHaveBeenCalled();
    });

    it("When a page field is updated Then the data service is called", () => {
        const idToUpdate = 2;
        const newValue = 0;
        const pageField = "anyField";

        controller.selectedPages = [idToUpdate];
        controller.updatePageField(pageField, newValue);

        expect(dataServiceToMock.updatePageField)
            .toHaveBeenCalledWith(pageField, [idToUpdate], newValue);
    });

    it("When selecting a page Then its id is on the selected pages", () => {
        const pageId = 5;
        controller.selectPage(pageId, false);

        expect(controller.selectedPages.indexOf(pageId)).toBeGreaterThanOrEqual(0);
    });

    it("When several pages are selected and a new one is selected Then only this will be at the selection list", () => {
        const pageId1 = 1;
        const pageId2 = 3;
        const pageId3 = 5;

        controller.selectedPages = [pageId1, pageId2];
        controller.selectPage(pageId3, false);

        expect(controller.selectedPages.indexOf(pageId1)).toBeLessThan(0);
        expect(controller.selectedPages.indexOf(pageId2)).toBeLessThan(0);
        expect(controller.selectedPages.indexOf(pageId3)).toBeGreaterThanOrEqual(0);
    });

    it("When several pages are selected and a new one is selected in multiselection " +
        "Then this will be added at the selection list", () => {
            const pageId1 = 1;
            const pageId2 = 3;
            const pageId3 = 5;

            controller.selectedPages = [pageId1, pageId2];
            controller.selectPage(pageId3, true);

            expect(controller.selectedPages.indexOf(pageId1)).toBeGreaterThanOrEqual(0);
            expect(controller.selectedPages.indexOf(pageId2)).toBeGreaterThanOrEqual(0);
            expect(controller.selectedPages.indexOf(pageId3)).toBeGreaterThanOrEqual(0);
        });

    it("When several pages are selected and a previously seleted one is selected in multiselection " +
        "Then this will be removed from the selection list", () => {
            const pageId1 = 1;
            const pageId2 = 3;

            controller.selectedPages = [pageId1, pageId2];
            controller.selectPage(pageId2, true);

            expect(controller.selectedPages.indexOf(pageId1)).toBeGreaterThanOrEqual(0);
            expect(controller.selectedPages.indexOf(pageId2)).toBeLessThan(0);
        });

    it("When a page is deleted Then the data service is called", () => {
        const idTodelete = 5;

        controller.deletePage(idTodelete);

        expect(dataServiceToMock.deletePage).toHaveBeenCalledWith(idTodelete);
    });

    it("When initialized then The capabilities are reported", () => {
        controller.$onInit();
        rootScopeService.$apply();

        expect(controller.capabilities[PageFields.PageSize]).toEqual(PageSizeCapabilities);
        expect(controller.capabilities[PageFields.PrintQuality]).toEqual(PrintQualityCapabilities);
        expect(controller.capabilities[PageFields.MediaType]).toEqual(MediaTypeCapabilities);
        expect(controller.capabilities[PageFields.Destination]).toEqual(DestinationCapabilities);
    });
});
