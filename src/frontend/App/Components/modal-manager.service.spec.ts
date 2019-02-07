import * as angular from "angular";
import { IModalInstanceService, IModalService, IModalSettings } from "../UiLib/definitions";
import { ModalManager } from "./modal-manager.service";

describe("Given a Modal Manager", () => {
    const dialogName = "name";
    const dialogSettings: IModalSettings = {};
    const minimumSettings = {
        backdrop: "static",
        keyboard: false,
        size: "sm"
    };
    let service: ModalManager;
    let modalServiceMock: IModalService;
    let instanceMock: IModalInstanceService;

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        modalManager: ModalManager,
        $uiLibModal: IModalService,
        $q: angular.IQService) => {
        service = modalManager;
        modalServiceMock = $uiLibModal;
        const promise = $q.resolve();
        instanceMock = {
            close: () => { angular.noop(); },
            result: promise
        }  as IModalInstanceService;
        spyOn(instanceMock, "close");
        spyOn(modalServiceMock, "open").and.returnValue(instanceMock);
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
            expect(service.register(dialogName, dialogSettings)).toBeFalsy();
        });
    });

    describe("And pushing a dialog", () => {

        it("When the dialog has not been previously registered Then it fails", () => {
            expect(service.push("name")).toBeFalsy();
        });

        describe("And the dialog has been previously registered", () => {
            beforeEach(() => {
                service.register(dialogName, dialogSettings);
            });

            it("Then it opens a dialog", () => {
                service.push(dialogName);

                expect(modalServiceMock.open).toHaveBeenCalled();
            });

            it("Then it opens a dialog", () => {
                service.push(dialogName);

                expect(modalServiceMock.open).toHaveBeenCalled();
            });

            it("Then it opens a dialog whit at least the minimum dialog settings", () => {
                const expectedSettings: IModalSettings = {};
                angular.extend(expectedSettings, dialogSettings, minimumSettings);

                service.push(dialogName);

                expect(modalServiceMock.open).toHaveBeenCalledWith(expectedSettings);
            });

            it("When params are pushed Then the dialog is opened with this params", () => {
                const params = {
                    id: 1
                };
                const expectedSettings: IModalSettings = {};
                angular.extend(expectedSettings, dialogSettings, minimumSettings, { resolve: { params } });

                service.push(dialogName, params);

                expect(modalServiceMock.open).toHaveBeenCalledWith(expectedSettings);
            });
        });

    });

    describe("And poping one dialog", () => {
        beforeEach(() => {
            service.register(dialogName, dialogSettings);
        });

        xit("When there is no dialog opened Then it fails", () => {
            expect(service.pop()).toBeFalsy();
        });

        xit("When there is a dialog opened Then it succeeds", () => {
            service.push(dialogName);

            expect(service.pop()).toBeTruthy();
        });

        it("When there is a dialog opened Then it closes the dialog", () => {
            service.push(dialogName);
            service.pop();

            expect(instanceMock.close).toHaveBeenCalled();
        });
    });

    describe("And replacing a dialog", () => {
        const otherDialog = {
            name: "dialogName",
            settings: {} as IModalSettings
        };

        beforeEach(() => {
            service.register(dialogName, dialogSettings);
            service.push(dialogName);
        });

        it("When the dialog has not been previously registered Then it fails", () => {
            expect(service.replaceTop(otherDialog.name)).toBeFalsy();
        });

        it("When there is a dialog opened Then it closes the dialog", () => {
            service.register(otherDialog.name, otherDialog.settings);
            service.replaceTop(otherDialog.name);

            expect(instanceMock.close).toHaveBeenCalled();
        });

        it("When params are send Then the dialog is opened with this params", () => {
            const params = {
                id: 1
            };
            const expectedSettings: IModalSettings = {};
            service.register(otherDialog.name, otherDialog.settings);
            angular.extend(expectedSettings, otherDialog.settings, minimumSettings, { resolve: { params } });

            service.replaceTop(dialogName, params);

            expect(modalServiceMock.open).toHaveBeenCalledWith(expectedSettings);
        });
    });
});
