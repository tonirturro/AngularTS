import * as angular from "angular";
import "angular-mocks";
import { DataService } from "./DataService"
import { Person } from "../Model/Person";
import { Page } from "../Model/Page";

const testMessage = "Test Message";
const testItem = "Test Item";
const testPerson = new Person(0, "Felipe", "Lotas");

describe("Data Service Test",
    () => {

        let service: DataService;
        let httpBackend: angular.IHttpBackendService;

        beforeEach(angular.mock.module("myApp"));

        beforeEach(inject((_dataService_, _$httpBackend_) => {
            service = _dataService_;
            httpBackend = _$httpBackend_;
            httpBackend.whenGET('REST').respond(200, { message: testMessage, items: [testItem], people: [testPerson] });
        }));
    
        it("Reads the data",
            (done) => {
                service.readModel(() => {
                    expect(service.message).toBe(testMessage);
                    expect(service.listItems[0]).toBe(testItem);
                    expect(service.people[0].id).toBe(testPerson.id);
                    expect(service.people[0].givenName).toBe(testPerson.givenName);
                    expect(service.people[0].famillyName).toBe(testPerson.famillyName);
                    done();
                });
                httpBackend.flush();
            });

        it("Adds user",
            (done) => {
                const givenName = "Alberto";
                const lastName = "Cadiscos";
                service.readModel(() => {
                    var beforeAdd = service.people.length;
                    var result = service.addUser(givenName, lastName);
                    expect(result).toBeTruthy();
                    expect(service.people.length).toBeGreaterThan(beforeAdd);
                    done();
                });
                httpBackend.flush();
            });

        it("Deletes user",
            (done) => {
                service.readModel(() => {
                    var beforeDelete = service.people.length;
                    var idToDelete = service.people[0].id;
                    var result = service.deleteUser(idToDelete);
                    expect(result).toBeTruthy();
                    expect(service.people.length).toBeLessThan(beforeDelete);
                    done();
                });
                httpBackend.flush();
            });

        it("Does not delete user if does not exists",
            (done) => {
                service.readModel(() => {
                    var beforeDelete = service.people.length;
                    var idToDelete = 9999;
                    var result = service.deleteUser(idToDelete);
                    expect(result).toBeFalsy();
                    expect(service.people.length).toBe(beforeDelete);
                    done();
                });
                httpBackend.flush();
            });

        it("Reads Pages",
            (done) => {
                httpBackend.whenGET('REST/pages').respond(200,[ new Page(1,2,3,4,5) ]);

                service.getPages().then( pages => {
                    expect(pages.length).toBe(1);
                    done();
                });

                httpBackend.flush();
            });
    });