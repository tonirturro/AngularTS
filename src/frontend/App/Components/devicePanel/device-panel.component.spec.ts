import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IQService, IRootScopeService, IScope } from "angular";
import { IDevice } from "../../../../common/rest";
import { DataService } from "../../Services/DataService";

describe("Given a device panel component", () => {
    const InitialDevices: IDevice[] = [
        { id: 0, name: "Device 1" },
        { id: 1, name: "Device 2" },
        { id: 2, name: "Device 3" }
    ];
    let element: IAugmentedJQuery;
    let scope: {
        selectedDeviceId: number,
        selectDevice: (id: number) => void
    } | any;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService,
        $q: IQService,
        dataService: DataService) => {
        spyOn(dataService, "getDevices").and.returnValue($q.resolve(InitialDevices));
        scope = $rootScope.$new();
        scope.selectedDeviceId = -1;
        scope.selectDevice = (id: number) => {
            scope.selectedDeviceId = id;
        };
        element = angular.element(`<device-panel selected-device-id="selectedDeviceId" />`);
        element = $compile(element)(scope);
        $rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When created Then it has the devices set by the model", () => {
        expect(element.find("tbody").find("tr").length).toBe(InitialDevices.length);
    });

    it("When created Then it has not selected devices", () => {
        const devices = element.find("tbody").find("tr");
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < devices.length; index++) {
            expect(devices[index].classList.contains("item-selected")).toBeFalsy();
        }
    });

    it("When clicking on a device Then it is selected", () => {
        scope.selectedDeviceId = InitialDevices[0].id;
        scope.$apply();
        const device = element.find("tbody").find("tr").find("td")[0];
        device.click();

        expect(device.classList.contains("item-selected")).toBeTruthy();
    });
});
