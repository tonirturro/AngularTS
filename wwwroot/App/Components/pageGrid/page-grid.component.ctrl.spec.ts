import * as angular from "angular";
import "angular-mocks";
import { PageGridController } from "./page-grid.component.ctrl";
import { DataService } from "../../Services/DataService";
import { Page } from "../../Model/Page";

describe("Page grid controller", () => {

    let controller: PageGridController;
    let dataServiceToMock: DataService;
    let promiseService: angular.IQService;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, $q, dataService) => {
        dataServiceToMock = dataService;
        promiseService = $q;
        spyOn(dataServiceToMock, "getPages").and.returnValue(promiseService.defer().promise);
        controller = $componentController("pageGrid");
    }));

    it("Has pages when initialized", () => {
        expect(controller.pages.length).toBe(0);
    });

    it("Can add pages", () => {
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(promiseService.defer().promise);

        controller.addPage();

        expect(dataServiceToMock.addNewPage).toHaveBeenCalledTimes(1);
    });

    it("Can delete pages", () => {
        const idTodelete = 5;

        spyOn(dataServiceToMock, "deletePage").and.returnValue(promiseService.defer().promise);

        controller.deletePage(idTodelete);

        expect(dataServiceToMock.deletePage).toHaveBeenCalledWith(idTodelete);
    });

    it("Can update page size", () => {
        const idToUpdate = 2;
        const newPageSize = 0;

        spyOn(dataServiceToMock, "updatePageSize").and.returnValue(promiseService.defer().promise);
        
        controller.updatePageSize(idToUpdate, newPageSize);

        expect(dataServiceToMock.updatePageSize).toHaveBeenCalledWith(idToUpdate, newPageSize);
    });
});
