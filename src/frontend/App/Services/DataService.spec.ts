import * as angular from "angular";
import { IHttpBackendService } from "angular";
import { PageFields } from "../../../common/model";
import { IDeleteDeviceResponse, IDeletePageResponse, IDevice, IPage, IUpdateResponse } from "../../../common/rest";
import { Page } from "../Model/Page";
import { DataService } from "./DataService";

describe("Data Service Test", () => {
        const restUrl = "http://localhost:3000/REST";
        const pagesUrl = `${restUrl}/pages/`;
        const devicesUrl = `${restUrl}/devices/`;
        const expectedPage: IPage = {
            destination: 5,
            deviceId: 1,
            id: 1,
            mediaType: 4,
            pageSize: 2,
            printQuality: 3,
        };

        /**
         * Data driven test case for the updates
         * @param field is the field to be updated
         * @param pageId is the id for the page to be updated
         * @param newValue is the new value to be set
         * @param done is the Mocha completion callback
         */
        const executeAndVerifyUpdate = (field: string, pageId: number, newValue: number, done: () => void) => {
            const response: IUpdateResponse = { success: true };
            httpBackend.whenPUT(`${pagesUrl}${field}`).respond(200, response);

            switch (field) {
                case PageFields.PageSize:
                    service.updatePageSize([pageId], newValue).then((success) => {
                        expect(success).toBeTruthy();
                        done();
                    });
                    break;
                case PageFields.PrintQuality:
                    service.updatePrintQuality([pageId], newValue).then((success) => {
                        expect(success).toBeTruthy();
                        done();
                    });
                    break;
                case PageFields.MediaType:
                    service.updateMediaType([pageId], newValue).then((success) => {
                        expect(success).toBeTruthy();
                        done();
                    });
                    break;
                case PageFields.Destination:
                    service.updateDestination([pageId], newValue).then((success) => {
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
        let httpBackend: IHttpBackendService;

        /**
         * Initialize test environment
         */
        beforeEach(angular.mock.module("myApp"));

        // tslint:disable-next-line:variable-name
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
                const page  = { id: 1 } as IPage;
                httpBackend.whenGET(pagesUrl)
                    .respond(200, [ expectedPage ]);

                service.getPages().then( (pages: Page[] ) => {
                    expect(pages.length).toBe(1);
                    done();
                });

                httpBackend.flush();
            });

        it("Translate from the model", (done) => {
            httpBackend.whenGET(pagesUrl).respond(200, [ expectedPage ]);

            service.getPages().then((pages: Page[]) => {
                expect(pages[0].pageSize).toBe(expectedPage.pageSize.toString());
                expect(pages[0].printQuality).toBe(expectedPage.printQuality.toString());
                expect(pages[0].mediaType).toBe(expectedPage.mediaType.toString());
                expect(pages[0].destination).toBe(expectedPage.destination.toString());
                done();
            });

            httpBackend.flush();
        });

        it("Can add pages", (done) => {
            const response: IUpdateResponse = { success: true };
            httpBackend.whenPOST(`${pagesUrl}${SelectedDeviceId}`).respond(200, response);

            service.addNewPage(SelectedDeviceId).then((success) => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        });

        it("Can delete pages", (done) => {
            const deleteResponse: IDeletePageResponse = {
                deletedPageId: 1,
                success: true
            };

            httpBackend.whenDELETE(`${pagesUrl}${deleteResponse.deletedPageId}`).respond(200, deleteResponse);

            service.deletePage(deleteResponse.deletedPageId).then((success) => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        });

        it("Can update page size", (done) => {
            executeAndVerifyUpdate(PageFields.PageSize, 10, 0, done);
        });

        it("Can update print quality", (done) => {
            executeAndVerifyUpdate(PageFields.PrintQuality, 20, 1, done);
        });

        it("Can update media type", (done) => {
            executeAndVerifyUpdate(PageFields.MediaType, 5, 2, done);
        });

        it("Can update destination", (done) => {
            executeAndVerifyUpdate(PageFields.Destination, 30, 0, done);
        });

        /***********************************************************************************************
         * Devices
         ***********************************************************************************************/
        it("Reads Devices", (done) => {
            const devicesResponse: IDevice[] = [{
                id: 1,
                name: "Device 2"
            }];

            httpBackend.whenGET(devicesUrl).respond(200, devicesResponse);

            service.getDevices().then( (devices) => {
                expect(devices.length).toBe(1);
                expect(devices[0].id).toBe(devicesResponse[0].id);
                expect(devices[0].name).toBe(devicesResponse[0].name);
                done();
            });

            httpBackend.flush();
        });

        it("Can add devices", (done) => {
            const response: IUpdateResponse = { success: true };
            httpBackend.whenPUT(devicesUrl).respond(200, response);

            service.addNewDevice().then((success) => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        });

        it("Can delete devices", (done) => {
            const deleteResponse: IDeleteDeviceResponse = { deletedDeviceId: 1, success: true };

            httpBackend
                .whenDELETE(`${devicesUrl}${deleteResponse.deletedDeviceId}`).respond(200, deleteResponse);

            service.deleteDevice(deleteResponse.deletedDeviceId).then((success) => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        });
    });
