import * as angular from "angular";
import { IRootScopeService } from "angular";
import "angular-mocks";
import { DataService } from "./DataService"

const testMessage = "Test Message";

describe("Data Service Test", () => {

    let service: DataService;
    let httpBackend: angular.IHttpBackendService;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject((_dataService_, _$httpBackend_) => {
        service = _dataService_
        httpBackend = _$httpBackend_;
    }));

    it("Reads the data", (done) => {
        httpBackend.expectGET('REST').respond(200, { _message: testMessage, _items:[], _people:[] });
        service.readModel(() => {
            expect(service.message).toBe(testMessage);
            done();
        });
        httpBackend.flush();
    })
})