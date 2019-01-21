import * as angular from "angular";
import { IModalInstanceService, IModalService, IModalSettings } from "../UiLib/definitions";
import { ModalManager } from "./ModalManager";

fdescribe("Given a Modal Manager", () => {
    const dialogName = "name";
    const dialogSettings: IModalSettings = {};
    const expectedModalInstance: IModalInstanceService = {
        close: () => { angular.noop(); },
        closed: null,
        dismiss: () => { angular.noop(); },
        opened: null,
        rendered: null,
        result: undefined
    };
    let service: ModalManager;
    let modalServiceMock: IModalService;
    let openModalMock: jasmine.Spy;

    beforeEach(angular.mock.module("myApp.services"));

    beforeEach(inject((
        modalManager: ModalManager,
        $uiLibModal: IModalService) => {
        service = modalManager;
        modalServiceMock = $uiLibModal;
        openModalMock = spyOn(modalServiceMock, "open").and.returnValue(expectedModalInstance);
    }));

    it("Is instantiated", () => {
        expect(service).toBeDefined();
    });

    describe("And registering dialogs", () => {

        it("When the dialog has not been previously registered Then it succeeds", () => {
            expect(service.register("name", {} as IModalSettings)).toBeTruthy();
        });

        it("When the dialog has been previously registered it fails", () => {
            service.register(dialogName, dialogSettings);
            expect(service.register("name", dialogSettings)).toBeFalsy();
        });
    });

    describe("And pushing a dialog", () => {

        it("When the dialog has not been previously registered Then it fails", () => {
            expect(service.push("name")).toBeFalsy();
        });

        it("When the dialog has been previously registered Then it returns a modal instance", () => {
            service.register(dialogName, dialogSettings);

            const instance = service.push(dialogName);

            expect(instance).toEqual(expectedModalInstance);
        });

        it("When the dialog has been previously registered Then it opens a dialog", () => {
            service.register(dialogName, dialogSettings);

            service.push(dialogName);

            expect(modalServiceMock.open).toHaveBeenCalled();
        });

        it("When the dialog has been previously registered " +
           "Then it opens a dialog whit at least the minimum dialog settings", () => {
            const minimumSettings = {
                backdrop: "static",
                keyboard: false,
                size: "sm"
            };
            const expectedSettings: IModalSettings = {};
            angular.extend(expectedSettings, dialogSettings, minimumSettings);
            service.register(dialogName, dialogSettings);

            service.push(dialogName);

            expect(modalServiceMock.open).toHaveBeenCalledWith(expectedSettings);
        });
    });

    describe("And poping one dialog", () => {
        let instanceMock: IModalInstanceService;

        beforeEach(() => {
            instanceMock = jasmine.createSpyObj("instanceMock", [ "close" ]);
            openModalMock.and.returnValue(instanceMock);
            service.register(dialogName, dialogSettings);
        });

        it("When there is no dialog opened Then it fails", () => {
            expect(service.pop()).toBeFalsy();
        });

        it("When there is a dialog opened Then it succeeds", () => {
            service.push(dialogName);

            expect(service.pop()).toBeTruthy();
        });

        it("When there is a dialog opened Then it closes the dialog", () => {
            service.push(dialogName);
            service.pop();

            expect(instanceMock.close).toHaveBeenCalled();
        });
    });
});
