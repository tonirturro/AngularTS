import * as angular from "angular";
import { IQService, IRootScopeService } from "angular";
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
        controller = $componentController("mainPage");
    }));

    it("When selecting device Then it is reflected by the associated property", () => {
        const ExpectedDeviceId = 5;
        controller.selectDevice(ExpectedDeviceId);
        expect(controller.selectedDeviceId).toBe(ExpectedDeviceId);
    });

    it("Can add devices", () => {
        spyOn(dataServiceToMock, "addNewDevice").and.returnValue(q.resolve(true));

        controller.addDevice();

        expect(dataServiceToMock.addNewDevice).toHaveBeenCalledTimes(1);
    });

    it("Add device broadcast model change event", () => {
        spyOn(dataServiceToMock, "addNewDevice").and.returnValue(q.resolve(true));
        spyOn(rootScopeService, "$broadcast");

        controller.addDevice();
        rootScopeService.$apply();

        expect(rootScopeService.$broadcast).toHaveBeenCalledTimes(1);
    });
});
