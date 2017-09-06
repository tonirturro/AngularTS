import * as angular from "angular";
import "angular-mocks";
import { ToolBarController } from "./toolbar.component.ctrl";
import { DataService } from "../../Services/DataService";

describe("Toolbar controller", () => {
    let controller: ToolBarController;
    let dataServiceToMock: DataService;
    let promiseService: angular.IQService;

    /**
     * Initialize the test environment
     */
    beforeEach(angular.mock.module("myApp"));
    
    beforeEach(inject(($componentController, $q, $rootScope, dataService) => {
        dataServiceToMock = dataService;
        promiseService = $q;
        controller = $componentController("toolBar");
    }));

    /**
     * The test cases
     */
    it("Can add devices", () => {
        spyOn(dataServiceToMock, "addNewDevice").and.returnValue(promiseService.defer().promise);

        controller.addDevice();

        expect(dataServiceToMock.addNewDevice).toHaveBeenCalledTimes(1);
    })
    
});