import { IAugmentedJQuery, ICompileService, IRootScopeService} from "angular";
import * as angular from "angular";
import { IStateService } from "../../ui-routes";

describe("Given a toolbar component", () => {
    let element: IAugmentedJQuery;
    let state: IStateService;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService,
        $state: IStateService) => {
        state = $state;
        element = angular.element(`<delete-device-dialog />`);
        element = $compile(element)($rootScope.$new());
        $rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When clicking the first button Then the dialog is closed", () => {
        spyOn(state, "go");
        const firstButton = element.find("button")[0];

        firstButton.click();

        expect(state.go).toHaveBeenCalledWith("^");
    });

    it("When clicking the second button Then the dialog is closed", () => {
        spyOn(state, "go");
        const secondButton = element.find("button")[1];

        secondButton.click();

        expect(state.go).toHaveBeenCalledWith("^");
    });
});
