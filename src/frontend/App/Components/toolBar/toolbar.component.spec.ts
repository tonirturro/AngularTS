import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IRootScopeService } from "angular";

describe("Given a toolbar component", () => {
    let element: IAugmentedJQuery;
    let addButtonClick: boolean;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService) => {
        const scope: any = $rootScope.$new();
        scope.addButton = () => {
            addButtonClick = true;
        };
        element = angular.element(`<toolbar on-add-device="addButton()"/>`);
        element = $compile(element)(scope);
        $rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When clicking on add device button Then the action is reported", () => {
        addButtonClick = false;
        const addButton = element.find("button")[0];
        addButton.click();

        expect(addButtonClick).toBeTruthy();
    });
});
