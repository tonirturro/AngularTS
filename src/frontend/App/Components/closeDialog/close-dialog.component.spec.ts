import { IAugmentedJQuery, ICompileService, IRootScopeService, IWindowService } from "angular";
import * as angular from "angular";
import { ModalManager } from "../modal-manager.service";

describe("Given a toolbar component", () => {
    let element: IAugmentedJQuery;
    let window: IWindowService;
    let modalManagerToMock: ModalManager;

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService,
        $window: IWindowService,
        modalManager: ModalManager) => {
        window = $window;
        modalManagerToMock = modalManager;
        element = angular.element(`<close-dialog />`);
        element = $compile(element)($rootScope.$new());
        $rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When clicking the first button Then the main window is closed", () => {
        spyOn(window, "close");
        const firstButton = element.find("button")[0];

        firstButton.click();

        expect(window.close).toHaveBeenCalled();
    });

    it("When clicking the second button Then the dialog is closed", () => {
        spyOn(modalManagerToMock, "pop");
        const secondButton = element.find("button")[1];

        secondButton.click();

        expect(modalManagerToMock.pop).toHaveBeenCalled();
    });
});
