import { IAugmentedJQuery, ICompileService, IRootScopeService, IWindowService } from "angular";
import * as angular from "angular";

describe("Given a toolbar component", () => {
    let element: IAugmentedJQuery;
    let rootScope: IRootScopeService;
    let window: IWindowService;
    let scope: any;
    let clickedOk: boolean;
    let clickedCancel: boolean;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService,
        $window: IWindowService) => {
        rootScope = $rootScope;
        window = $window;
        scope = $rootScope.$new();
        scope.ok = () => {
            clickedOk = true;
        };
        scope.cancel = () => {
            clickedCancel = true;
        };
        element = angular.element(`<close-dialog ` +
                                    `close="ok()" ` +
                                    `dismiss="cancel()" />`);
        element = $compile(element)(scope);
        rootScope.$apply();
        clickedOk = false;
        clickedCancel = false;
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When clicking the first button Then an ok is reported and the main window is closed", () => {
        spyOn(window, "close");
        const firstButton = element.find("button")[0];

        firstButton.click();

        expect(clickedOk).toBeTruthy();
        expect(clickedCancel).toBeFalsy();
        expect(window.close).toHaveBeenCalled();
    });

    it("When clicking the second button Then a cancel is reported", () => {
        const secondButton = element.find("button")[1];

        secondButton.click();

        expect(clickedOk).toBeFalsy();
        expect(clickedCancel).toBeTruthy();
    });
});
