import * as angular from "angular";
import { IHttpBackendService } from "angular";
import { PageFields } from "../../../common/model";
import {
    IDeleteDeviceResponse,
    IDeletePageResponse,
    IDevice,
    IPage,
    ISelectableOption,
    IUpdateResponse
} from "../../../common/rest";
import { DataService } from "./DataService";

describe("Data Service Test", () => {
        const restUrl = "http://localhost:3000/REST";
        const pagesUrl = `${restUrl}/pages/`;
        const devicesUrl = `${restUrl}/devices/`;
        const deviceOptionsUrl = `${restUrl}/deviceOptions/`;
        const expectedPage: IPage = {
            destination: 5,
            deviceId: 1,
            id: 1,
            mediaType: 4,
            pageSize: 2,
            printQuality: 3,
        };
        const response: IUpdateResponse = { success: true };

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
                httpBackend.whenGET(pagesUrl)
                    .respond(200, [ expectedPage ]);

                service.getPages().then((pages) => {
                    expect(pages.length).toBe(1);
                    done();
                });

                httpBackend.flush();
            });

        it("Translate from the model", (done) => {
            httpBackend.whenGET(pagesUrl).respond(200, [ expectedPage ]);

            service.getPages().then((pages) => {
                expect(pages[0].pageSize).toBe(expectedPage.pageSize.toString());
                expect(pages[0].printQuality).toBe(expectedPage.printQuality.toString());
                expect(pages[0].mediaType).toBe(expectedPage.mediaType.toString());
                expect(pages[0].destination).toBe(expectedPage.destination.toString());
                done();
            });

            httpBackend.flush();
        });

        it("Can add pages", (done) => {
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

        it("Can update page field", (done) => {
            const fieldToSet = "anyField";
            httpBackend.whenPUT(`${pagesUrl}${fieldToSet}`).respond(200, response);

            service.updatePageField(fieldToSet, [ 10 ], 0).then((succes) => {
                expect(succes).toBeTruthy();
                done();
            });

            httpBackend.flush();
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

        it("Can read device page options", (done) => {
            const devicePageOptionsResponse: ISelectableOption[] = [
                { value: "0", label: "label0 "}
            ];

            httpBackend.whenGET(`${deviceOptionsUrl}${PageFields.PageSize}`).respond(200, devicePageOptionsResponse);

            service.getCapabilities(PageFields.PageSize).then((options) => {
                expect(options).toEqual(devicePageOptionsResponse);
                done();
            });

            httpBackend.flush();
        });
    });
