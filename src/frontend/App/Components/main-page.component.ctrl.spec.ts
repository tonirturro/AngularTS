import * as angular from "angular";
import { IQService, IRootScopeService } from "angular";
import { ModelUpdate } from "../Model/ModelEvents";
import { DataService } from "../Services/DataService";
import { MainPageController } from "./main-page.component.ctrl";

describe("Given a main page component controller", () => {
    let controller: MainPageController;
    let q: IQService;
    let rootScopeService: IRootScopeService;
    let dataServiceToMock: DataService;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, $q, $rootScope, dataService) => {
        rootScopeService = $rootScope;
        dataServiceToMock = dataService;
        q = $q;
        spyOn(dataServiceToMock, "getDevices").and.returnValue(q.resolve([]));
        spyOn(dataServiceToMock, "addNewDevice").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "deleteDevice").and.returnValue(q.resolve(true));
        controller = $componentController("mainPage");
    }));

    it("When is ititialized then it gets the existing devices", () => {
        controller.$onInit();

        expect(dataServiceToMock.getDevices).toHaveBeenCalled();
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
});
