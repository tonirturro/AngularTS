import * as angular from "angular";
import { IQService, IRootScopeService } from "angular";
import { PageFields } from "../../../common/model";
import { ModelUpdate } from "../Model/ModelEvents";
import { DataService } from "../Services/DataService";
import { MainPageController } from "./main-page.component.ctrl";

describe("Given a main page component controller", () => {
    let controller: MainPageController;
    let q: IQService;
    let rootScopeService: IRootScopeService;
    let dataServiceToMock: DataService;
    let getPagesMock: jasmine.Spy;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, $q, $rootScope, dataService) => {
        rootScopeService = $rootScope;
        dataServiceToMock = dataService;
        q = $q;
        spyOn(dataServiceToMock, "getDevices").and.returnValue(q.resolve([]));
        spyOn(dataServiceToMock, "addNewDevice").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "deleteDevice").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "updatePageField").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "deletePage").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(q.resolve(true));
        getPagesMock = spyOn(dataServiceToMock, "getPages");
        getPagesMock.and.returnValue(q.resolve(true));
        controller = $componentController("mainPage");
    }));

    it("When is ititialized Then it gets the existing devices", () => {
        controller.$onInit();

        expect(dataServiceToMock.getDevices).toHaveBeenCalled();
    });

    it("When it is initialized Then it gets the available pages", () => {
        controller.$onInit();

        expect(dataServiceToMock.getPages).toHaveBeenCalled();
    });

    it("When it is initialized Then it has not selected pages", () => {
        expect(controller.selectedPages.length).toBe(0);
    });

    it("When selecting device Then it is reflected by the associated property", () => {
        const ExpectedDeviceId = 5;
        controller.selectDevice(ExpectedDeviceId);
        expect(controller.selectedDeviceId).toBe(ExpectedDeviceId);
    });

    it("When adding a device Then the data service is called", () => {
        controller.addDevice();

        expect(dataServiceToMock.addNewDevice).toHaveBeenCalledTimes(1);
    });

    it("When adding a device Then a model change event is broadcasted", () => {
        spyOn(rootScopeService, "$broadcast");

        controller.addDevice();
        rootScopeService.$apply();

        expect(rootScopeService.$broadcast).toHaveBeenCalledTimes(1);
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

    it("When a model update device event raises Then the device list is queried", () => {
        controller.$onInit();
        rootScopeService.$broadcast(ModelUpdate.Devices);

        expect(dataServiceToMock.getDevices).toHaveBeenCalled();
    });

    it("When a model update device event raises " +
        "Then the device list is not queried if the component has been destroyed", () => {
            controller.$onInit();
            controller.$onDestroy();
            rootScopeService.$broadcast(ModelUpdate.Devices);

            expect(dataServiceToMock.getDevices).toHaveBeenCalledTimes(1);
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

    it("When a page field is updated Then the pages are reloaded", () => {
        const idToUpdate = 3;
        const newValue = 1;
        const pageField = "anyField";

        controller.selectedPages = [idToUpdate];
        controller.updatePageField(pageField, newValue);
        rootScopeService.$apply();

        expect(dataServiceToMock.getPages).toHaveBeenCalled();
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

    it("Delete page refresh page list", () => {
        getPagesMock.calls.reset();

        controller.deletePage(0);
        rootScopeService.$apply();

        expect(dataServiceToMock.getPages).toHaveBeenCalled();
    });

    it("The page is added to the selected device Id", () => {
        controller.selectedDeviceId = 5;

        controller.addPage();

        expect(dataServiceToMock.addNewPage).toHaveBeenCalledWith(controller.selectedDeviceId);
    });

    it("Add pages refresh page list", () => {
        getPagesMock.calls.reset();
        controller.selectedDeviceId = 5;

        controller.addPage();
        rootScopeService.$apply();

        expect(dataServiceToMock.getPages).toHaveBeenCalled();
    });
});
