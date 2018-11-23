import * as angular from "angular";
import { IHttpBackendService, IHttpService, IQService, IRootScopeService } from "angular";
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
import { IUpdateParams } from "./interfaces";

describe("Given a data service", () => {
        const restUrl = "http://localhost:3000/REST";
        const pagesUrl = `${restUrl}/pages/`;
        const devicesUrl = `${restUrl}/devices/`;
        const deviceOptionsUrl = `${restUrl}/deviceOptions/`;
        const expectedPages: IPage[] = [{
            destination: "5",
            deviceId: 1,
            id: 1,
            mediaType: "4",
            pageSize: "2",
            printQuality: "3",
        }];
        const response: IUpdateResponse = {
            success: true
        };
        const deletePageResponse: IDeletePageResponse = {
            deletedPageId: 1,
            success: true
        };
        const updateParams = { pages: [10], newValue: "0" } as IUpdateParams;

        /**
         * Common test resources
         */
        const SelectedDeviceId = 1;
        let service: DataService;
        let httpBackend: IHttpBackendService;
        let http: IHttpService;
        let q: IQService;
        let rootscope: IRootScopeService;

        /**
         * Initialize test environment
         */
        beforeEach(angular.mock.module("myApp"));

        beforeEach(inject((
                dataService: DataService,
                $rootScope: IRootScopeService,
                $q: IQService,
                $http: IHttpService,
                $httpBackend: IHttpBackendService) => {
            service = dataService;
            rootscope = $rootScope;
            q = $q;
            httpBackend = $httpBackend;
            http = $http;
            httpBackend.whenGET(pagesUrl).respond(200, expectedPages);
        }));

        /**
         *
         * The test cases
         *
         */

         /************************************************************************
          * Pages
          ************************************************************************/
        it("When is working Then it exposes the available pages", () => {
            let pages = service.pages;
            httpBackend.flush();
            pages = service.pages;

            expect(pages.length).toBe(expectedPages.length);
        });

        it("Can add pages", () => {
            spyOn(http, "post").and.returnValue(q.resolve());

            service.addNewPage(SelectedDeviceId);

            expect(http.post).toHaveBeenCalledWith(`${pagesUrl}${SelectedDeviceId}`, {});
        });

        it("When adding pages Then it refreshes the page list", () => {
            spyOn(http, "post").and.returnValue(q.resolve({ data: response }));
            spyOn(http, "get").and.returnValue(q.resolve({ data: expectedPages }));

            service.addNewPage(SelectedDeviceId);
            rootscope.$apply();

            expect(http.get).toHaveBeenCalledWith(pagesUrl);
        });

        it("Can delete pages", () => {
            const ExpectedCall = `${pagesUrl}${deletePageResponse.deletedPageId}`;
            spyOn(http, "delete").and.returnValue(q.resolve());

            service.deletePage(deletePageResponse.deletedPageId);

            expect(http.delete).toHaveBeenCalledWith(ExpectedCall);
        });

        it("When deleting pages Then the page list is reloaded", () => {
            spyOn(http, "delete").and.returnValue(q.resolve({ data: deletePageResponse }));
            spyOn(http, "get").and.returnValue(q.resolve({ data: expectedPages }));

            service.deletePage(deletePageResponse.deletedPageId);
            rootscope.$apply();

            expect(http.get).toHaveBeenCalledWith(pagesUrl);
        });

        it("Can update page field", () => {
            const fieldToSet = "anyField";
            const ExpectedCall = `${pagesUrl}${fieldToSet}`;
            spyOn(http, "put").and.returnValue(q.resolve());

            service.updatePageField(fieldToSet, updateParams.pages, updateParams.newValue);

            expect(http.put).toHaveBeenCalledWith(ExpectedCall, JSON.stringify(updateParams));
        });

        it("When updating pages Then the page list is reloaded", () => {
            const fieldToSet = "anyField";
            spyOn(http, "put").and.returnValue(q.resolve({ data: response }));
            spyOn(http, "get").and.returnValue(q.resolve({ data: expectedPages }));

            service.updatePageField(fieldToSet, updateParams.pages, updateParams.newValue);
            rootscope.$apply();

            expect(http.get).toHaveBeenCalledWith(pagesUrl);
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
            const deleteDeviceResponse: IDeleteDeviceResponse = { deletedDeviceId: 1, success: true };

            httpBackend
                .whenDELETE(`${devicesUrl}${deleteDeviceResponse.deletedDeviceId}`).respond(200, deleteDeviceResponse);

            service.deleteDevice(deleteDeviceResponse.deletedDeviceId).then((success) => {
                expect(success).toBeTruthy();
                done();
            });

            httpBackend.flush();
        });

        it ("When reading capabilities for the first time Then they are got from the model", () => {
            const ExpectedCall = `${deviceOptionsUrl}${PageFields.PageSize}`;
            spyOn(http, "get").and.returnValue(q.resolve({}));

            const capabilities = service.getCapabilities(PageFields.PageSize);

            expect(capabilities.length).toBe(0);
            expect(http.get).toHaveBeenCalledWith(ExpectedCall);
        });

        it ("When reading capabilities after the first time and before the model responds" +
            "Then they are'nt got from the model", () => {
            const ExpectedCall = `${deviceOptionsUrl}${PageFields.PageSize}`;
            const getSpy = spyOn(http, "get");
            getSpy.and.returnValue(q.resolve({}));

            let capabilities = service.getCapabilities(PageFields.PageSize);
            getSpy.calls.reset();
            capabilities = service.getCapabilities(PageFields.PageSize);

            expect(capabilities.length).toBe(0);
            expect(http.get).not.toHaveBeenCalled();
        });

        it("Can read device page options", () => {
            const devicePageOptionsResponse: ISelectableOption[] = [
                { value: "0", label: "label0 "}
            ];

            httpBackend.whenGET(`${deviceOptionsUrl}${PageFields.PageSize}`).respond(200, devicePageOptionsResponse);

            let capabilities = service.getCapabilities(PageFields.PageSize);
            httpBackend.flush();
            capabilities = service.getCapabilities(PageFields.PageSize);

            expect(capabilities).toEqual(devicePageOptionsResponse);
        });
    });
