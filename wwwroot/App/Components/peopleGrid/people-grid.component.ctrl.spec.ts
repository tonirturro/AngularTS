import * as angular from "angular";
import "angular-mocks";
import { PeopleGridController } from "./people-grid.component.ctrl";
import { DataService } from "../../Services/DataService";
import { Person } from "../../Model/Person";

describe("People grid controller", () => {

    const existingId = 1;
    const testPerson = new Person(existingId, "aaa", "bbb"); let controller: PeopleGridController;

    let dataServiceToMock: DataService;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, dataService, $httpBackend) => {
        let httpBackend: angular.IHttpBackendService;

        dataServiceToMock = dataService;
        httpBackend = $httpBackend;
        httpBackend.whenGET('REST').respond(200, { message: "", items: [], people: [testPerson] });
        controller = $componentController("peopleGrid");
        httpBackend.flush();
    }));

    it("The controller is initialized with the model", () => {
        expect(controller.people[0].id).toBe(existingId);
    })

    it("Delete contact service is called", () => {
        spyOn<DataService>(dataServiceToMock, "deleteUser");

        controller.deleteContact(existingId);

        expect(dataServiceToMock.deleteUser).toHaveBeenCalledWith(existingId);
    });

    it("Delete contact in fact deletes the contact", () => {
        spyOn<DataService>(dataServiceToMock, "deleteUser").and.returnValue(true);
        spyOnProperty<DataService>(dataServiceToMock, "people", "").and.returnValue([]);

        controller.deleteContact(existingId);

        expect(controller.people.length).toBe(0);
    });

    it("Unexisting contact is not deleted", () => {
        spyOn<DataService>(dataServiceToMock, "deleteUser").and.returnValue(false);
           
        controller.deleteContact(existingId + 1);

        expect(controller.people.length).toBe(1);
    });
});
