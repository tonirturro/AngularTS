import * as angular from "angular";
import "angular-mocks";
import { DevicePanelController } from "./device-panel.component.ctrl";
import { DataService } from "../../Services/DataService";
import { Device } from "../../Model/Device";
import { ModelUpdate } from  "../../Model/ModelEvents";

describe("Device panel controller", () => {

    /**
     * Common test resources
     */
    let controller: DevicePanelController;
    let dataServiceToMock: DataService;
    let promiseService: angular.IQService;
    let rootScopeService: angular.IRootScopeService;

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
    }));
    
    /**
     * The test cases
     */
    it("Has devices when initialized", () => {
        expect(controller.devices.length).toBe(0);
    });

    it("Can delete device", () => {
        const idToDelete = 4;
        spyOn(dataServiceToMock, "deleteDevice").and.returnValue(promiseService.defer().promise);

        controller.deleteDevice(idToDelete);

        expect(dataServiceToMock.deleteDevice).toHaveBeenCalledWith(idToDelete);
    });

    it("Delete device updates the device list",() => {
        let defer:angular.IDeferred<boolean> = promiseService.defer();
        let promise:angular.IPromise<boolean> = defer.promise;
        spyOn(dataServiceToMock, "deleteDevice").and.returnValue(promise);

        controller.deleteDevice(0);
        defer.resolve(true);
        rootScopeService.$apply();

        expect(dataServiceToMock.getDevices).toHaveBeenCalledTimes(2);
    });

    it("Model update for devices updates devices list", () => {
        rootScopeService.$broadcast(ModelUpdate.Devices.toString());

        expect(dataServiceToMock.getDevices).toHaveBeenCalledTimes(2);
    });
});