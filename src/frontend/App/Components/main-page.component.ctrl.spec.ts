import * as angular from "angular";
import { IComponentControllerService, IPromise, IQService, IRootScopeService, IWindowService } from "angular";
import { EModals } from ".";
import { PageFields } from "../../../common/model";
import { IDevice, ISelectableOption } from "../../../common/rest";
import { DataService } from "../Services/DataService";
import { IStateService } from "../ui-routes";
import { IMessageParam } from "./definitions";
import { IDeviceSelection, MainPageController } from "./main-page.component.ctrl";
import { ModalManager } from "./modal-manager.service";

describe("Given a main page component controller", () => {
    let controller: MainPageController;
    let q: IQService;
    let rootScope: IRootScopeService;
    let stateServiceToMock: IStateService;
    let dataServiceToMock: DataService;
    let windowCloseMock: jasmine.Spy;
    let modalPushMock: jasmine.Spy;

    const devices: IDevice[] = [{
        id: 1,
        name: "Device 2"
    }];
    const PageSizeCapabilities: ISelectableOption[] = [
        { value: "0", label: "page0" },
        { value: "1", label: "page1" }
    ];
    const PrintQualityCapabilities: ISelectableOption[] = [
        { value: "0", label: "quality0" },
        { value: "1", label: "quality1" }
    ];
    const MediaTypeCapabilities: ISelectableOption[] = [
        { value: "0", label: "media0" },
        { value: "1", label: "media1" }
    ];
    const DestinationCapabilities: ISelectableOption[] = [
        { value: "0", label: "destination0" },
        { value: "1", label: "destination1" }
    ];

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
            $componentController: IComponentControllerService,
            $q: IQService,
            $rootScope: IRootScopeService,
            $state: IStateService,
            $window: IWindowService,
            dataService: DataService,
            modalManager: ModalManager) => {
        stateServiceToMock = $state;
        dataServiceToMock = dataService;
        q = $q;
        rootScope = $rootScope;
        spyOn(stateServiceToMock, "go");
        modalPushMock = spyOn(modalManager, "push");
        windowCloseMock = spyOn($window, "close");
        spyOnProperty(dataServiceToMock, "devices").and.returnValue(devices);
        spyOn(dataServiceToMock, "addNewDevice").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "deleteDevice").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "updatePageField").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "deletePage").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "getCapabilities")
            .and.callFake((capability: string): IPromise<ISelectableOption[]> => {
                switch (capability) {
                    case PageFields.PageSize:
                        return q.resolve(PageSizeCapabilities);
                    case PageFields.PrintQuality:
                        return q.resolve(PrintQualityCapabilities);
                    case PageFields.MediaType:
                        return q.resolve(MediaTypeCapabilities);
                    case PageFields.Destination:
                        return q.resolve(DestinationCapabilities);
                    default:
                        return q.reject("Invalid field");
                }
            });
        controller = $componentController("mainPage", {});
    }));

    it("When is ititialized Then it gets the existing devices", () => {
        controller.$onInit();

        expect(controller.devices).toEqual(devices);
    });

    it("When it is initialized Then it has not selected pages", () => {
        expect(controller.selectedPages.length).toBe(0);
    });

    it("When it is initialized Then it goes to the pages edition", () => {
        controller.selectedDeviceId = devices[0].id;
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };
        controller.$onInit();

        expect(stateServiceToMock.go).toHaveBeenCalledWith("pages", expectedDeviceSelection);
    });

    it("When calling edit devices Then the view changes to the device edition", () => {
        controller.selectedDeviceId = devices[0].id;
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };
        controller.editDevices();

        expect(controller.editingDevices).toBeTruthy();
        expect(stateServiceToMock.go).toHaveBeenCalledWith("device", expectedDeviceSelection);
    });

    it("When calling edit pages Then the view changes to the pages edition", () => {
        controller.selectedDeviceId = devices[0].id;
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };
        controller.editPages();

        expect(controller.editingDevices).toBeFalsy();
        expect(stateServiceToMock.go).toHaveBeenCalledWith("pages", expectedDeviceSelection);
    });

    it("When selecting device Then it is reflected by the associated property", () => {
        const ExpectedDeviceId = 5;
        controller.selectDevice(ExpectedDeviceId);
        expect(controller.selectedDeviceId).toBe(ExpectedDeviceId);
    });

    it("When selecting device Then the view is adjusted with the selected device", () => {
        const ExpectedDeviceId = 8;
        controller.editingDevices = true;
        controller.selectDevice(ExpectedDeviceId);
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };

        expect(stateServiceToMock.go).toHaveBeenCalledWith("device", expectedDeviceSelection);
    });

    it("When adding a device Then the data service is called", () => {
        controller.addDevice();

        expect(dataServiceToMock.addNewDevice).toHaveBeenCalled();
    });

    it("When deleting a device Then a dialog is open", () => {
        modalPushMock.and.returnValue(q.reject());
        const expectedDeviceSelection: IMessageParam = { message: `Delete Device: ${devices[0].name}` };

        controller.deleteDevice(devices[0].id);

        expect(modalPushMock).toHaveBeenCalledWith(EModals.Confimation, expectedDeviceSelection);
    });

    it("When deleting a device dialog is confirmed Then the device is deleted", () => {
        modalPushMock.and.returnValue(q.resolve());
        controller.deleteDevice(devices[0].id);
        rootScope.$apply();

        expect(dataServiceToMock.deleteDevice).toHaveBeenCalledWith(devices[0].id);
    });

    it("When deleting a device dialog is not confirmed Then the device is not deleted", () => {
        modalPushMock.and.returnValue(q.reject());
        controller.deleteDevice(devices[0].id);
        rootScope.$apply();

        expect(dataServiceToMock.deleteDevice).not.toHaveBeenCalled();
    });

    it("When calling close Then a dialog is open", () => {
        modalPushMock.and.returnValue(q.reject());
        const expectedDialogMessage: IMessageParam = { message: "Close Application" };

        controller.close();

        expect(modalPushMock).toHaveBeenCalledWith(EModals.Confimation, expectedDialogMessage);
    });

    it("When closing app is confirmed then the application is closed", () => {
        modalPushMock.and.returnValue(q.resolve());

        controller.close();
        rootScope.$apply();

        expect(windowCloseMock).toHaveBeenCalled();
    });

    it("When closing app is not confirmed then the application is not closed", () => {
        modalPushMock.and.returnValue(q.reject());

        controller.close();
        rootScope.$apply();

        expect(windowCloseMock).not.toHaveBeenCalled();
    });
});
