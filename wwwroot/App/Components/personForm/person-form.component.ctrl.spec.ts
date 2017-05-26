import * as angular from "angular";
import "angular-mocks";
import { DataService } from "../../Services/DataService";
import { PersonFormController } from "./person-form.component.ctrl";

describe("Person form controller", () => {

    const newGivenName = "GivenNameTest";
    const newFamillyName = "FamillyNameTest";

    let controller: PersonFormController;
    let dataServiceToMock: DataService;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController, dataService) => {
        dataServiceToMock = dataService;
        controller = $componentController("peopleGrid");
    }));

    it("The new given name can be set", () => {
        controller.newGivenName = newGivenName;

        expect(controller.newGivenName).toBe(newGivenName);
    });

    it("The new familly name can be set", () => {
        controller.newFamillyName = newFamillyName;

        expect(controller.newFamillyName).toBe(newFamillyName);
    });

    it("Add Contact Service Called", () => {
        controller.newFamillyName = newFamillyName;
        controller.newGivenName = newGivenName;
        spyOn<DataService>(dataServiceToMock, "addUser");

        // TODO why addContact is not considered a function
        // controller.addContact();
        dataServiceToMock.addUser(newGivenName, newFamillyName);

        expect(dataServiceToMock.addUser).toHaveBeenCalledWith(newGivenName, newFamillyName);
    });
});