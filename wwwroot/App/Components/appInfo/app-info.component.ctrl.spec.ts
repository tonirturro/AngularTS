import * as angular from "angular";
import "angular-mocks";
import { AppInfoController } from "./app-info.component.ctrl";
import { DataService } from "../../Services/DataService";

describe("Application Info ", () => {

    const testMessage = "test";
    const testItems = ["item1", "item2", "item3"];

    let controller: AppInfoController;
    let dataServiceToMock: DataService;  

    beforeEach(angular.mock.module("myApp"));
 
    beforeEach(inject(($componentController, dataService, _$httpBackend_) => {
        let httpBackend: angular.IHttpBackendService;

        dataServiceToMock = dataService;
        httpBackend = _$httpBackend_;
        httpBackend.whenGET('REST').respond(200, { message: testMessage, items: testItems, people: [] });
        controller = $componentController("appInfo");
        httpBackend.flush();
    }));

    it("The controller is initialized with the model", () => {
        expect(controller.message).toBe(testMessage);

        for (var i = 0; i < controller.listItems.length; i++) {
            expect(controller.listItems[i]).toBe(testItems[i]);
        }
    });

    it("Information is initially visible", () => {
        expect(controller.infoAvailable).toBeTruthy();
        expect(controller.infoMessage).toBe(controller.hideInfoStr);
    });

    it("Troggle changes information visibility", () => {
        controller.troggleInfo();

        expect(controller.infoAvailable).toBeFalsy();
        expect(controller.infoMessage).toBe(controller.showInfoStr);
    });
});