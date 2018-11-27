import { IAugmentedJQuery, ICompileService, IRootScopeService } from "angular";
import * as angular from "angular";

describe("Given a toolbar component", () => {
    let element: IAugmentedJQuery;
    let rootScope: IRootScopeService;
    let scope: any;
    let clickedOk: boolean;
    let clickedCancel: boolean;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService) => {
        rootScope = $rootScope;
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

    it("When clicking the first button Then an ok is reported", () => {
        const firstButton = element.find("button")[0];

        firstButton.click();

        expect(clickedOk).toBeTruthy();
        expect(clickedCancel).toBeFalsy();
    });

    it("When clicking the second button Then a cancel is reported", () => {
        const secondButton = element.find("button")[1];

        secondButton.click();

        expect(clickedOk).toBeFalsy();
        expect(clickedCancel).toBeTruthy();
    });
});
