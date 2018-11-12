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
    let reportedSelectedDeviceId: number;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService,
        $q: IQService,
        dataService: DataService) => {
        spyOn(dataService, "getDevices").and.returnValue($q.resolve(InitialDevices));
        scope = $rootScope.$new();
        scope.selectedDeviceId = -1;
        reportedSelectedDeviceId = -1;
        scope.selectDevice = (deviceId: number) => {
            reportedSelectedDeviceId = deviceId;
        };
        element =
            angular.element(`<device-panel ` +
                            `selected-device-id="selectedDeviceId" ` +
                            `on-selected-device="selectDevice(deviceId)" />`);
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
        const device = element.find("tbody").find("tr").find("td")[0];
        device.click();

        expect(device.classList.contains("item-selected")).toBeTruthy();
    });

    it("When clicking on a device Then only this is selected", () => {
        const selectedItem = 0;
        const devices = element.find("tbody").find("tr").find("td");
        devices[selectedItem].click();

        for (let index = 0; index < devices.length; index++) {
            if (index === selectedItem) {
                expect(devices[index].classList.contains("item-selected")).toBeTruthy();
            } else {
                expect(devices[index].classList.contains("item-selected")).toBeFalsy();
            }
        }

    });

    it("When clicking on a device Then its selection is reported", () => {
        const selectedItem = 1;
        const device = element.find("tbody").find("tr").find("td")[selectedItem];
        device.click();

        expect(reportedSelectedDeviceId).toEqual(InitialDevices[selectedItem].id);
    });
});
