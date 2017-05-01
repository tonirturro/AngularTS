import * as angular from "angular";
import "angular-mocks";
import { IMainControllerScope, MainController } from "./MainController";
import { Person } from "./Model/Person";

describe("Controller Test", function () {

    // Arrange
    let mockScope: IMainControllerScope;
    let controller: MainController;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($controller, $rootScope) => {
        mockScope = $rootScope.$new();
        controller = $controller("MainController", {
            $scope: mockScope
        });
    }));

    it("Initial Info Visibility", () => {
        expect(mockScope.infoAvailable).toBeTruthy();
        expect(mockScope.infoMessage).toEqual("Hide Info");
    });

    it("Troggle Info Visibility", () => {
        mockScope.troggleInfo();
        expect(mockScope.infoAvailable).toBeFalsy();
        expect(mockScope.infoMessage).toEqual("Show Info");
    });

    it("Change Familly Name", () => {
        var newName = "NewFamillyName";
        mockScope.changeFamillyName(newName);
        expect(mockScope.newFamillyName).toEqual(newName);
    });

    it("Change Given Name", () => {
        var newName = "NewGivenName";
        mockScope.changeGivenName(newName);
        expect(mockScope.newGivenName).toEqual(newName);
    });

    it("Add Contact", () => {
        mockScope.people = [];
        mockScope.newFamillyName = "familly";
        mockScope.newGivenName = "given";
        mockScope.addContact();
        expect(mockScope.people.length).toEqual(1);
        expect(mockScope.people[0].famillyName).toBe(mockScope.newFamillyName);
        expect(mockScope.people[0].givenName).toBe(mockScope.newGivenName);
    });

    it("Delete Contact", () => {
        const newID = 5;
        mockScope.people = [];
        mockScope.people.push(new Person(newID, "given", "familly"));

        mockScope.deleteContact(newID);

        expect(mockScope.people.length).toEqual(0);
    });

});