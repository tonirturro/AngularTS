import * as angular from "angular";
import "angular-mocks";
import { DevicePanelController } from "./device-panel.component.ctrl";
import { DataService } from "../../Services/DataService";
import { Device } from "../../Model/Device";

describe("Device panel controller", () => {

    /**
     * Common test resources
     */
    let controller: DevicePanelController;
    let dataServiceToMock: DataService;
    let promiseService: angular.IQService;
    let deferredGetDevices: angular.IDeferred<Device[]>;

    /**
     * Initialize the test environment
     */
    beforeEach(angular.mock.module("myApp"));
    
    beforeEach(inject(($componentController, $q, $rootScope, dataService) => {
        dataServiceToMock = dataService;
        promiseService = $q;
        deferredGetDevices = promiseService.defer();
        spyOn(dataServiceToMock, "getDevices").and.returnValue(deferredGetDevices.promise);
        controller = $componentController("devicePanel");
    }));
    
    /**
     * The test cases
     */
    it("Has devices when initialized", () => {
        expect(controller.devices.length).toBe(0);
    });
});