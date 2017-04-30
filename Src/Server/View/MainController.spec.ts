import * as angular from "angular";
import "angular-mocks";
import { IMainControllerScope, MainController } from "./MainController";

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
        mockScope.addContact();
        expect(mockScope.people.length).toEqual(1);
    });

    it("Delete Contact", () => {
        mockScope.people = [];
        mockScope.addContact();

        var idToDelete = mockScope.people[0].id;

        mockScope.deleteContact(idToDelete);
        expect(mockScope.people.length).toEqual(0);
    });

});