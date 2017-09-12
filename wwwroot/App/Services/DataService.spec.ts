import * as angular from "angular";
import "angular-mocks";
import { DataService } from "./DataService"

describe("Data Service Test", () => {

        /**
         * Data driven test case for the updates
         * @param field is the field to be updated
         * @param pageId is the id for the page to be updated
         * @param newValue is the new value to be set
         * @param done is the Mocha completion callback
         */
        var executeAndVerifyUpdate = (field: string, pageId:number, newValue: number, done:() => void) => {
            httpBackend.whenPUT(`REST/pages/${field}`).respond(200, { success: true });

            switch (field) {
                case service.PageSizeField:
                    service.updatePageSize([pageId], newValue).then(success => {
                        expect(success).toBeTruthy();
                        done();
                    });
                    break;
                case service.PrintQualityField:
                    service.updatePrintQuality([pageId], newValue).then(success => {
                        expect(success).toBeTruthy();
                        done();
                    });
                    break;
                case service.MediaTypeField:
                    service.updateMediaType([pageId], newValue).then(success => {
                        expect(success).toBeTruthy();
                        done();
                    });
                    break;
                case service.DestinationField:
                    service.updateDestination([pageId], newValue).then(success => {
                        expect(success).toBeTruthy();
                        done();
                    });
                    break;
            }
            
            httpBackend.flush();
        };

        /**
         * Common test resources
         */
        const SelectedDeviceId = 1;
        let service: DataService;
        let httpBackend: angular.IHttpBackendService;

        /**
         * Initialize test environment
         */
        beforeEach(angular.mock.module("myApp"));

        beforeEach(inject((_dataService_, _$httpBackend_) => {
            service = _dataService_;
            httpBackend = _$httpBackend_;
        }));
    
        /**
         * 
         * The test cases
         * 
         */

         /************************************************************************
          * Pages
          ************************************************************************/
        it("Reads Pages", (done) => {
                httpBackend.whenGET('REST/pages').respond(200, [{ id: 1, deviceId:1, pageSize: 0, printQuality: 0, mediaType: 0, destination: 0 }]);

                service.getPages().then( pages => {
                    expect(pages.length).toBe(1);
                    done();
                });

                httpBackend.flush();
            });

        it("Translate from the model", (done) => {
            const expectedPageSize = 3;
            const expectedPrintQuality = 0;
            const expectedMediaType = 1;
            const expectedDestination = 2;

            httpBackend.whenGET('REST/pages').respond(200, [{
                id: 1,
                deviceId: 1,
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
            httpBackend.whenPOST(`REST/pages/${SelectedDeviceId}`).respond(200, { success: true });

            service.addNewPage(SelectedDeviceId).then(success => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        });

        it("Can delete pages", (done) => {
            const idTodelete = 1;

            httpBackend.whenDELETE(`REST/pages/${idTodelete}`).respond(200, { deletedPageId: idTodelete, success: true });

            service.deletePage(idTodelete).then(success => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        })

        it("Can update page size", (done) => {
            executeAndVerifyUpdate(service.PageSizeField, 10, 0, done);
        });

        it("Can update print quality", (done) => {
            executeAndVerifyUpdate(service.PrintQualityField, 20, 1, done);
        });

        it("Can update media type", (done) => {
            executeAndVerifyUpdate(service.MediaTypeField, 5, 2, done);
        });

        it("Can update destination", (done) => {
            executeAndVerifyUpdate(service.DestinationField, 30, 0, done);
        });

        /***********************************************************************************************
         * Devices
         ***********************************************************************************************/
        it("Reads Devices", (done) => {
            const ExpectedDeviceId = 1;
            const ExpectedDeviceName = "Device 2";

            httpBackend.whenGET('REST/devices').respond(200, [{ id: ExpectedDeviceId, name: ExpectedDeviceName}]);

            service.getDevices().then( devices => {
                expect(devices.length).toBe(1);
                expect(devices[0].id).toBe(ExpectedDeviceId);
                expect(devices[0].name).toBe(ExpectedDeviceName);
                done();
            });

            httpBackend.flush();
        });

        it("Can add devices", (done) => {
            httpBackend.whenPUT('REST/devices').respond(200, { success: true });

            service.addNewDevice().then(success => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        });

        it("Can delete devices", (done) => {
            const idTodelete = 1;

            httpBackend.whenDELETE(`REST/devices/${idTodelete}`).respond(200, { deletedDeviceId: idTodelete, success: true });

            service.deleteDevice(idTodelete).then(success => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        })
    });