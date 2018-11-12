import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IQService, IRootScopeService } from "angular";
import { DataService } from "../../Services/DataService";
import { IVisualPage } from "./page-grid.component.ctrl";

describe("Given a page grid component ", () => {
    const SelectedDeviceId = 1;
    let element: IAugmentedJQuery;
    let scope: any;
    let rootScope: IRootScopeService;

    const InitialPages: IVisualPage[] = [
        { id: 0, deviceId: SelectedDeviceId } as IVisualPage,
        { id: 1, deviceId: SelectedDeviceId } as IVisualPage,
        { id: 2, deviceId: SelectedDeviceId } as IVisualPage
    ];

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService,
        dataService: DataService,
        $q: IQService) => {
        rootScope = $rootScope;
        spyOn(dataService, "getPages").and.returnValue($q.resolve(InitialPages));
        spyOn(dataService, "getCapabilities").and.returnValue($q.resolve(""));
        scope = $rootScope.$new();
        scope.selectedDeviceID = SelectedDeviceId;
        element = angular.element(`<page-grid selected-device-id="selectedDeviceID" />`);
        element = $compile(element)(scope);
        rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When created Then the component has the pages set by the model", () => {
        expect(element.find("tbody").find("tr").length).toBe(InitialPages.length);
    });

    it("When the selected device id does not match the one from the initiial pages " +
       "Then the component does not display any page", () => {
        scope.selectedDeviceID = SelectedDeviceId + 1;
        rootScope.$apply();

        expect(element.find("tbody").find("tr").length).toBe(0);
    });

    it("When created Then it has not selected pages", () => {
        const pages = element.find("tbody").find("tr");
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < pages.length; index++) {
            expect(pages[index].classList.contains("item-selected")).toBeFalsy();
        }
    });

    it("When clicking on a page Then it is selected", () => {
        const page = element.find("tbody").find("tr")[0];
        page.click();

        expect(page.classList.contains("item-selected")).toBeTruthy();
    });

    it("When different pages are clicked Then only the last one remains clicked", () => {
        const pages = element.find("tbody").find("tr");
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < pages.length; index++) {
            pages[index].click();
        }
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < pages.length; index++) {
            if (index < pages.length - 1 ) {
                expect(pages[index].classList.contains("item-selected")).toBeFalsy();
            } else {
                expect(pages[index].classList.contains("item-selected")).toBeTruthy();
            }
        }
    });
});
