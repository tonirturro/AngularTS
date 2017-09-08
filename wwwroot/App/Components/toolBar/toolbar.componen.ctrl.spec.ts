import * as angular from "angular";
import "angular-mocks";
import { ToolBarController } from "./toolbar.component.ctrl";
import { DataService } from "../../Services/DataService";
import { ModelUpdate } from  "../../Model/ModelEvents";

describe("Toolbar controller", () => {
    let controller: ToolBarController;
    let dataServiceToMock: DataService;
    let promiseService: angular.IQService;
    let rootScopeService: angular.IRootScopeService;

    /**
     * Initialize the test environment
     */
    beforeEach(angular.mock.module("myApp"));
    
    beforeEach(inject(($componentController, $q, $rootScope, dataService) => {
        dataServiceToMock = dataService;
        rootScopeService = $rootScope;
        promiseService = $q;
        controller = $componentController("toolbar");
    }));

    /**
     * The test cases
     */
    it("Can add devices", () => {
        spyOn(dataServiceToMock, "addNewDevice").and.returnValue(promiseService.defer().promise);

        controller.addDevice();

        expect(dataServiceToMock.addNewDevice).toHaveBeenCalledTimes(1);
    })

    it("Add device broadcast model change event", () => {
        let defer:angular.IDeferred<boolean> = promiseService.defer();
        let promise:angular.IPromise<boolean> = defer.promise;
        spyOn(dataServiceToMock, "addNewDevice").and.returnValue(promise);
        spyOn(rootScopeService, "$broadcast");

        controller.addDevice();
        defer.resolve(true);
        rootScopeService.$apply();

        expect(rootScopeService.$broadcast).toHaveBeenCalledTimes(1);
    });
    
});