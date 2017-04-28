import * as angular from "angular";
import { IMainControllerScope } from "./MainController";

describe("Controller Test", function () {

    // Arrange
    var mockScope = <IMainControllerScope>{};
    var controller;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(angular.mock.inject(function ($controller, $rootScope) {
        mockScope = $rootScope.$new();
        controller = $controller("MainController", {
            $scope: mockScope
        });
    }));

    it("Initial Info Visibility", function () {
        expect(mockScope.infoAvailable).toBeTruthy();
        expect(mockScope.infoMessage).toEqual("Hide Info");
    });

    it("Troggle Info Visibility", function () {
        mockScope.troggleInfo();
        expect(mockScope.infoAvailable).toBeFalsy();
        expect(mockScope.infoMessage).toEqual("Show Info");
    });

    it("Change Familly Name", function () {
        var newName = "NewFamillyName";
        mockScope.changeFamillyName(newName);
        expect(mockScope.newFamillyName).toEqual(newName);
    });

    it("Change Given Name", function () {
        var newName = "NewGivenName";
        mockScope.changeGivenName(newName);
        expect(mockScope.newGivenName).toEqual(newName);
    });

    it("Add Contact", function () {
        mockScope.people = [];
        mockScope.addContact();
        expect(mockScope.people.length).toEqual(1);
    });

    it("Delete Contact", function () {
        mockScope.people = [];
        mockScope.addContact();

        var idToDelete = mockScope.people[0].id;

        mockScope.deleteContact(idToDelete);
        expect(mockScope.people.length).toEqual(0);
    });

});