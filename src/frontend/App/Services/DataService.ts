import { UpdateParams } from "./UpdateParams";

import { IHttpService, ILogService, IQService } from "angular";
import { Device } from "../Model/Device";
import { Page } from "../Model/Page";

/*
** Service to access data from the backend
*/
export class DataService {

    /**
     * Define dependencies
     */
    public static $inject =  ["$http", "$log", "$q"];

    /**
     * Field tags
     */
    public readonly PageSizeField = "pageSize";
    public readonly PrintQualityField = "printQuality";
    public readonly MediaTypeField = "mediaType";
    public readonly DestinationField = "destination";

    /**
     * Internal constants
     */
    private readonly REST_URL = "http://localhost:3000/REST";

    /**
     * Initializes a new instance of the DataService class.
     * @param $http is the Angular http service.
     * @param $log is the Angular log services.
     * @param $q is the Angular promise services.
     */
    constructor(
        private $http: IHttpService,
        private $log: ILogService,
        private $q: IQService) {
    }

    /**
     * Gets pages from backend
     */
    public getPages(): angular.IPromise<Page[]> {

        const deferred: angular.IDeferred<Page[]> = this.$q.defer();

        this.$http
            .get<[{
                id,
                deviceId: number,
                pageSize: number,
                printQuality: number,
                mediaType: number,
                destination: number}]>(this.getUrl("pages")).then((response) => {
            let pages: Page[];

            pages = [];

            // Translate from the model
            response.data.forEach((newPage) => {
                pages.push(new Page(
                    newPage.id,
                    newPage.deviceId,
                    newPage.pageSize.toString(),
                    newPage.printQuality.toString(),
                    newPage.mediaType.toString(),
                    newPage.destination.toString()));
            });

            deferred.resolve(pages);
        },
        (errors) => {
            this.$log.error(`Failure to get ${this.getUrl("pages")}`);
            deferred.reject(errors.data);
        });

        return deferred.promise;
    }

    /**
     * Gets devices from backend
     */
    public getDevices(): angular.IPromise<Device[]> {

        const deferred: angular.IDeferred<Device[]> = this.$q.defer();

        this.$http.get<[Device]>(this.getUrl("devices")).then((response) => {
            deferred.resolve(response.data);
        },
        (errors) => {
            this.$log.error(`Failure to get ${this.getUrl("devices")}`);
            deferred.reject(errors.data);
        });

        return deferred.promise;
    }

    /**
     * Request a new page
     */
    public addNewPage(deviceId: number): angular.IPromise<boolean> {
        const deferred: angular.IDeferred<boolean> = this.$q.defer();

        this.$http.post<{ success: boolean }>(`${this.getUrl("pages")}${deviceId}`, {}).then((response) => {
            deferred.resolve(response.data.success);
        },
        (errors) => {
            this.$log.error(`Failure to post ${this.getUrl("pages")}${deviceId}`);
            deferred.reject(errors.data);
        });

        return deferred.promise;
    }

    /**
     * Request a new device
     */
    public addNewDevice(): angular.IPromise<boolean> {
        const deferred: angular.IDeferred<boolean> = this.$q.defer();

        this.$http.put<{ success: boolean }>(this.getUrl("devices"), {}).then((response) => {
            deferred.resolve(response.data.success);
        },
        (errors) => {
            this.$log.error(`Failure to put ${this.getUrl("devices")}`);
            deferred.reject(errors.data);
        });

        return deferred.promise;
    }

    /**
     * Delete an existing page
     * @param idToDelete is the id for the page to be deleted
     */
    public deletePage(idToDelete: number): angular.IPromise<boolean> {
        const deferred: angular.IDeferred<boolean> = this.$q.defer();

        this.$http.delete<{ deletedPageId: number, success: boolean }>(`${this.getUrl("pages")}${idToDelete}`)
            .then((response) => {
                deferred.resolve(response.data.success && response.data.deletedPageId === idToDelete);
            },
            (errors) => {
                this.$log.error(`Failure to delete ${this.getUrl("pages")}${idToDelete}`);
                deferred.reject(errors.data);
            });

        return deferred.promise;
    }

    /**
     * Delete an existing device
     * @param idToDelete is the id for the device to be deleted
     */
    public deleteDevice(idToDelete: number): angular.IPromise<boolean> {
        const deferred: angular.IDeferred<boolean> = this.$q.defer();

        this
            .$http.delete<{
                deletedDeviceId: number,
                success: boolean }>(`${this.getUrl("devices")}${idToDelete}`).then((response) => {
            deferred.resolve(response.data.success && response.data.deletedDeviceId === idToDelete);
        },
        (errors) => {
            this.$log.error(`Failure to delete ${this.getUrl("devices")}${idToDelete}`);
            deferred.reject(errors.data);
        });

        return deferred.promise;
    }

    /**
     * Updates the page size for an existing page
     * @param idToUpdate is the id for the page to be updated
     * @param newValueToSet is the new page size value
     */
    public updatePageSize(pages: number[], newValueToSet: number): angular.IPromise<boolean> {
        return this.performUpdate(this.PageSizeField, new UpdateParams(pages, newValueToSet));
    }

    /**
     * Updates the print quality for an existing page
     * @param idToUpdate is the id for the page to be updated
     * @param newValueToSet is the new print quality value
     */
    public updatePrintQuality(pages: number[], newValueToSet: number): angular.IPromise<boolean> {
        return this.performUpdate(this.PrintQualityField, new UpdateParams(pages, newValueToSet));
    }

    /**
     * Updates the media type for an existing page
     * @param idToUpdate is the id for the page to be updated
     * @param newValueToSet is the new media type value
     */
    public updateMediaType(pages: number[], newValueToSet: number): angular.IPromise<boolean> {
        return this.performUpdate(this.MediaTypeField, new UpdateParams(pages, newValueToSet));
    }

    /**
     * Updates the media type for an existing page
     * @param idToUpdate is the id for the page to be updated
     * @param newValueToSet is the new media type value
     */
    public updateDestination(pages: number[], newValueToSet: number): angular.IPromise<boolean> {
        return this.performUpdate(this.DestinationField, new UpdateParams(pages, newValueToSet));
    }

    /**
     * Executes the update for the designated field and with the corresponding parameters
     * @param field is the field to be updated
     * @param params are the params for the update
     */
    private performUpdate(field: string, params: UpdateParams): angular.IPromise<boolean> {
        const deferred: angular.IDeferred<boolean> = this.$q.defer();

        this.$http.put<{ success: boolean }>(`${this.getUrl("pages")}${field}`, JSON.stringify(params))
            .then((response) => {
                deferred.resolve(response.data.success);
            },
            (errors) => {
                this.$log.error(`Failure to put ${this.getUrl("pages")}${field}`);
                deferred.reject(errors.data);
            });

        return deferred.promise;
    }

    /**
     * Composes the url for an api
     * @param the api to be composed
     */
    private getUrl(api: string): string {
        return `${this.REST_URL}/${api}/`;
    }
}
