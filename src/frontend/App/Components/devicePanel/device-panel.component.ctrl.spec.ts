import * as angular from "angular";
import { IDeferred, IPromise, IQService, IRootScopeService } from "angular";

import { DevicePanelController } from "./device-panel.component.ctrl";

import { DataService } from "../../Services/DataService";

import { ModelUpdate } from "../../Model/ModelEvents";
import { doesNotReject } from "assert";

describe("Device panel controller", () => {

    /**
     * Common test resources
     */
    const SelectedDeviceId = 5;
    let controller: DevicePanelController;
    let dataServiceToMock: DataService;
    let promiseService: IQService;
    let rootScopeService: IRootScopeService;

    /**
     * Initialize the test environment
     */
    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, $q, $rootScope, dataService) => {
        dataServiceToMock = dataService;
        promiseService = $q;
        rootScopeService = $rootScope;
        spyOn(dataServiceToMock, "getDevices").and.returnValue(promiseService.defer().promise);
        controller = $componentController("devicePanel");
        controller.$onInit();
    }));

    /**
     * The test cases
     */
    it("Has devices when initialized", () => {
        expect(controller.Devices.length).toBe(0);
    });

    it("Can delete device", () => {
        const idToDelete = 4;
        spyOn(dataServiceToMock, "deleteDevice").and.returnValue(promiseService.defer().promise);

        controller.deleteDevice(idToDelete);

        expect(dataServiceToMock.deleteDevice).toHaveBeenCalledWith(idToDelete);
    });

    it("Delete selected device changes selection", (done) => {
        const defer: IDeferred<boolean> = promiseService.defer();
        const promise: IPromise<boolean> = defer.promise;
        spyOn(dataServiceToMock, "deleteDevice").and.returnValue(promise);
        controller.selectedDeviceId = SelectedDeviceId;
        controller.onSelectedDevice = (data: { deviceId: number }) => {
            expect(data.deviceId).not.toBe(SelectedDeviceId);
            done();
        };

        controller.deleteDevice(SelectedDeviceId);
        defer.resolve(true);
        rootScopeService.$apply();
    });

    it("Delete device updates the device list", () => {
        const defer: angular.IDeferred<boolean> = promiseService.defer();
        const promise: angular.IPromise<boolean> = defer.promise;
        spyOn(dataServiceToMock, "deleteDevice").and.returnValue(promise);

        controller.deleteDevice(0);
        defer.resolve(true);
        rootScopeService.$apply();

        expect(dataServiceToMock.getDevices).toHaveBeenCalledTimes(2);
    });

    it("Model update for devices updates devices list", () => {
        rootScopeService.$broadcast(ModelUpdate.Devices);

        expect(dataServiceToMock.getDevices).toHaveBeenCalledTimes(2);
    });

    it("Model update for devices does not updates devices list after the component is destroyed", () => {
        controller.$onDestroy();
        rootScopeService.$broadcast(ModelUpdate.Devices);

        expect(dataServiceToMock.getDevices).toHaveBeenCalledTimes(1);
    });
});
