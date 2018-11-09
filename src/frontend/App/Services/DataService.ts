import { IDeferred, IHttpService, ILogService, IPromise, IQService } from "angular";

import { PageFields } from "../../../common/model";
import { IDeleteDeviceResponse, IDevice, IPage, ISelectableOption, IUpdateResponse } from "../../../common/rest";
import { IVisualPage } from "../Components/pageGrid/page-grid.component.ctrl";
import { UpdateParams } from "./UpdateParams";

/*
** Service to access data from the backend
*/
export class DataService {

    /**
     * Define dependencies
     */
    public static $inject =  ["$http", "$log", "$q"];

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
    public getPages(): IPromise<IVisualPage[]> {

        const deferred: IDeferred<IVisualPage[]> = this.$q.defer();

        this.$http
            .get<IPage[]>(this.getUrl("pages")).then((response) => {
            let pages: IVisualPage[];

            pages = [];

            // Translate from the model
            response.data.forEach((newPage) => {
                const translatedPage: IVisualPage = {} as IVisualPage;
                translatedPage.id = newPage.id;
                translatedPage.deviceId = newPage.deviceId;
                translatedPage.pageSize = newPage.pageSize.toString();
                translatedPage.printQuality = newPage.printQuality.toString();
                translatedPage.mediaType = newPage.mediaType.toString();
                translatedPage.destination = newPage.destination.toString();
                pages.push(translatedPage);
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
    public getDevices(): IPromise<IDevice[]> {

        const deferred: IDeferred<IDevice[]> = this.$q.defer();

        this.$http.get<IDevice[]>(this.getUrl("devices")).then((response) => {
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
    public addNewPage(deviceId: number): IPromise<boolean> {
        const deferred: IDeferred<boolean> = this.$q.defer();

        this.$http.post<IUpdateResponse>(`${this.getUrl("pages")}${deviceId}`, {}).then((response) => {
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
    public addNewDevice(): IPromise<boolean> {
        const deferred: IDeferred<boolean> = this.$q.defer();

        this.$http.put<IUpdateResponse>(this.getUrl("devices"), {}).then((response) => {
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
    public deletePage(idToDelete: number): IPromise<boolean> {
        const deferred: IDeferred<boolean> = this.$q.defer();

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
    public deleteDevice(idToDelete: number): IPromise<boolean> {
        const deferred: IDeferred<boolean> = this.$q.defer();

        this.$http.delete<IDeleteDeviceResponse>(`${this.getUrl("devices")}${idToDelete}`).then((response) => {
            deferred.resolve(response.data.success && response.data.deletedDeviceId === idToDelete);
        },
        (errors) => {
            this.$log.error(`Failure to delete ${this.getUrl("devices")}${idToDelete}`);
            deferred.reject(errors.data);
        });

        return deferred.promise;
    }

    /**
     * Querybthe options available for a particular device capability
     * @param capability the capability to be queried
     */
    public getCapabilities(capability: string): IPromise<ISelectableOption[]> {
        const deferred: IDeferred<ISelectableOption[]> = this.$q.defer();

        this.$http.get<ISelectableOption[]>(`${this.getUrl("deviceOptions")}${capability}`).then((response) => {
            deferred.resolve(response.data);
        },
        (errors) => {
            this.$log.error(`Failure to get ${capability} device capability`);
            deferred.reject(errors.data);
        });

        return deferred.promise;
    }

    /**
     * Updates the page size for an existing page
     * @param idToUpdate is the id for the page to be updated
     * @param newValueToSet is the new page size value
     */
    public updatePageSize(pages: number[], newValueToSet: number): IPromise<boolean> {
        return this.performUpdate(PageFields.PageSize, new UpdateParams(pages, newValueToSet));
    }

    /**
     * Updates the print quality for an existing page
     * @param idToUpdate is the id for the page to be updated
     * @param newValueToSet is the new print quality value
     */
    public updatePrintQuality(pages: number[], newValueToSet: number): IPromise<boolean> {
        return this.performUpdate(PageFields.PrintQuality, new UpdateParams(pages, newValueToSet));
    }

    /**
     * Updates the media type for an existing page
     * @param idToUpdate is the id for the page to be updated
     * @param newValueToSet is the new media type value
     */
    public updateMediaType(pages: number[], newValueToSet: number): IPromise<boolean> {
        return this.performUpdate(PageFields.MediaType, new UpdateParams(pages, newValueToSet));
    }

    /**
     * Updates the media type for an existing page
     * @param idToUpdate is the id for the page to be updated
     * @param newValueToSet is the new media type value
     */
    public updateDestination(pages: number[], newValueToSet: number): IPromise<boolean> {
        return this.performUpdate(PageFields.Destination, new UpdateParams(pages, newValueToSet));
    }

    /**
     * Executes the update for the designated field and with the corresponding parameters
     * @param field is the field to be updated
     * @param params are the params for the update
     */
    private performUpdate(field: string, params: UpdateParams): IPromise<boolean> {
        const deferred: angular.IDeferred<boolean> = this.$q.defer();

        this.$http.put<IUpdateResponse>(`${this.getUrl("pages")}${field}`, JSON.stringify(params))
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
