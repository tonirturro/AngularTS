import * as angular from "angular";
import "angular-mocks";
import { PageGridController } from "./page-grid.component.ctrl";
import { DataService } from "../../Services/DataService";

describe("Page grid controller", () => {

    let controller: PageGridController;
    let dataServiceToMock: DataService;
    let promiseService: angular.IQService;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, dataService, $q) => {
        dataServiceToMock = dataService;
        promiseService = $q;
        spyOn(dataServiceToMock, "getPages").and.callFake(() => {
            var deferred = promiseService.defer();
            deferred.resolve([]);
            return deferred.promise;
        });
        controller = $componentController("pageGrid");
    }));

    it("Has pages when initialized", () => {
        expect(controller.pages.length).toBe(0);
    });

    it("Can add pages", () => {
        spyOn(dataServiceToMock, "addNewPage").and.callFake(() => {
            var deferred = promiseService.defer();
            deferred.resolve(true);
            return deferred.promise;
        });

        controller.addPage();

        expect(dataServiceToMock.addNewPage).toHaveBeenCalledTimes(1);
    });

    it("Can delete pages", () => {
        const idTodelete = 5;

        spyOn(dataServiceToMock, "deletePage").and.callFake(() => {
            var deferred = promiseService.defer();
            deferred.resolve(true);
            return deferred.promise;
        });

        controller.deletePage(idTodelete);

        expect(dataServiceToMock.deletePage).toHaveBeenCalledWith(idTodelete);
    });
});
