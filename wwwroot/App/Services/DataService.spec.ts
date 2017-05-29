import * as angular from "angular";
import "angular-mocks";
import { DataService } from "./DataService"

describe("Data Service Test",
    () => {

        let service: DataService;
        let httpBackend: angular.IHttpBackendService;

        beforeEach(angular.mock.module("myApp"));

        beforeEach(inject((_dataService_, _$httpBackend_) => {
            service = _dataService_;
            httpBackend = _$httpBackend_;
        }));
    
        it("Reads Pages",
            (done) => {
                httpBackend.whenGET('REST/pages').respond(200, [{ id: 1, pageSize: 0, printQuality: 0, mediaType: 0, destination: 0 }]);

                service.getPages().then( pages => {
                    expect(pages.length).toBe(1);
                    done();
                });

                httpBackend.flush();
            });

        it("Translate from the model", (done) => {
            var expectedPageSize = 3;
            var expectedPrintQuality = 0;
            var expectedMediaType = 1;
            var expectedDestination = 2;

            httpBackend.whenGET('REST/pages').respond(200, [{
                id: 1,
                pageSize: expectedPageSize,
                printQuality: expectedPrintQuality,
                mediaType: expectedMediaType,
                destination: expectedDestination
            }]);

            service.getPages().then(pages => {
                expect(pages[0].pageSize).toBe(expectedPageSize.toString());
                expect(pages[0].printQuality).toBe(expectedPrintQuality.toString());
                expect(pages[0].mediaType).toBe(expectedMediaType.toString());
                expect(pages[0].destination).toBe(expectedDestination.toString());
                done();
            });

            httpBackend.flush();
        })

        it("Can add pages", (done) => {
            httpBackend.whenPUT('REST/pages').respond(200, { success: true });

            service.addNewPage().then(success => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        });

        it("Can delete pages", (done) => {
            var idTodelete = 1;

            httpBackend.whenDELETE(`REST/pages/${idTodelete}`).respond(200, { deletedPageId: idTodelete, success: true });

            service.deletePage(idTodelete).then(success => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        })
    });