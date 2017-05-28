import * as angular from "angular";
import "angular-mocks";
import { PageGridController } from "./page-grid.component.ctrl";
import { DataService } from "../../Services/DataService";

describe("Page grid controller", () => {

    let controller: PageGridController;

    let dataServiceToMock: DataService;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, dataService, $httpBackend) => {
        let httpBackend: angular.IHttpBackendService;

        dataServiceToMock = dataService;
        httpBackend = $httpBackend;
        httpBackend.whenGET('REST/pages').respond(200, [{ id: 1, pageSize: 0, printQuality: 0, mediaType: 0, destination:0}]);
        controller = $componentController("pageGrid");
        httpBackend.flush();
    }));

    it("The controller is initialized with the model", () => {
        expect(controller.pages.length).toBeGreaterThan(0);
    });
});
