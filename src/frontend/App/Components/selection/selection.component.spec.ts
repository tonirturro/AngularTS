import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IRootScopeService } from "angular";
import { ISelectionOption } from "./selection";
import { SelectionController } from "./selection.component.ctrl";

describe("Given a selection component ", () => {

    let compile: ICompileService;
    let rootScope: IRootScopeService;
    let scope: any;
    let element: IAugmentedJQuery;
    let controler: SelectionController;
    const options: ISelectionOption[] = [
        {
            label: "option 1",
            value: 0
        },
        {
            label: "option 2",
            value: 1
        }
    ];

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService
    ) => {
        compile = $compile;
        rootScope = $rootScope;
        scope = $rootScope.$new();
        scope.options = options;
        scope.selectedOption = options[1].value;
    }));

    beforeEach(() => {
        element = angular.element(`<selection options="options" selected-option="selectedOption" />`);
        compile(element)(scope);
        rootScope.$apply();
        controler = element.controller("selection");
    });

    it("When instantiated then it contains a selector", () => {
        expect(element.html()).toContain("select");
        expect(element.html()).toContain("option");
    });

    it("When instantiated then there is as many selections as options", () => {
        expect(controler.options.length).toEqual(options.length);
        expect(element[0].children[0].children.length).toEqual(options.length);
    });

    it("When it is instantiated it has the right selected option", () => {
        expect(controler.selectedOption).toEqual(scope.selectedOption);
    });

});
