import { IDeferred, IHttpService, ILogService, IPromise, IQService } from "angular";
import {
    IDeleteDeviceResponse,
    IDeletePageResponse,
    IDevice,
    IPage,
    ISelectableOption,
    IUpdateParams,
    IUpdateResponse
} from "../../../common/rest";

interface ICapabilitiesDictionary {
    [key: string]: ISelectableOption[];
}

interface IGettingCapabilitiesDictionary {
    [key: string]: boolean;
}

/*
** Service to access data from the backend
*/
export class DataService {
    /**
     * Define dependencies
     */
    public static $inject = ["$http", "$log", "$q"];

    /**
     * Internal constants
     */
    private readonly REST_URL = "http://localhost:3000/REST";

    /**
     * Internal properties
     */
    private cachedPages: IPage[];
    private defaultCachedPages: IPage[] = [];
    private isGettingPages: boolean = false;
    private cachedCapabilities: ICapabilitiesDictionary = {};
    private isGettingCapabilities: IGettingCapabilitiesDictionary = {};
    private defaultCachedCapabilities: ISelectableOption[] = [];

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
     * Gets the current cached pages
     */
    public get pages(): IPage[] {
        if (this.cachedPages) {
            return this.cachedPages;
        }

        if (!this.isGettingPages) {
            this.isGettingPages = true;
            this.updatePages();
        }

        return this.defaultCachedPages;
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
     * Get the options available for a particular device capability
     * @param capability the capability to be queried
     */
    public getCapabilities(capability: string): ISelectableOption[] {
        if (this.cachedCapabilities[capability]) {
            return this.cachedCapabilities[capability];
        }

        if (!this.isGettingCapabilities[capability]) {
            this.isGettingCapabilities[capability] = true;
            this.getCapabilitiesFromModel(capability);
        }

        return this.defaultCachedCapabilities;
    }

    /**
     * Request a new page
     */
    public addNewPage(deviceId: number) {
        this.$http.post<IUpdateResponse>(`${this.getUrl("pages")}${deviceId}`, {}).then((response) => {
            if (response.data.success) {
                this.updatePages();
            } else {
                this.$log.error(`Error while adding new page to device : ${deviceId}`);
            }
        },
            () => {
                this.$log.error(`Failure to post ${this.getUrl("pages")}${deviceId}`);
            });
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
    public deletePage(idToDelete: number) {

        this.$http.delete<IDeletePageResponse>(`${this.getUrl("pages")}${idToDelete}`)
            .then((response) => {
                if (response.data.success) {
                    this.updatePages();
                } else {
                    this.$log.error(`Error while deleting page id: ${idToDelete}`);
                }
            },
                () => {
                    this.$log.error(`Failure to delete ${this.getUrl("pages")}${idToDelete}`);
                });
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
     * Updates a particular field for a set of pages
     * @param field The field to be updated
     * @param pages The pages to be updated
     * @param newValueToSet The new value to be set
     */
    public updatePageField(field: string, pages: number[], newValue: string) {
        this.performUpdate(field, { pages, newValue } as IUpdateParams);
    }

    /**
     * Executes the update for the designated field and with the corresponding parameters
     * @param field is the field to be updated
     * @param params are the params for the update
     */
    private performUpdate(field: string, params: IUpdateParams) {
        this.$http.put<IUpdateResponse>(`${this.getUrl("pages")}${field}`, JSON.stringify(params))
            .then((response) => {
                if (response.data.success) {
                    this.updatePages();
                } else {
                    this.$log.error(`Error while updating field ${field} for page id: ${params.pages[0]}`);
                }
            },
                () => {
                    this.$log.error(`Failure to put ${this.getUrl("pages")}${field}`);
                });
    }

    /**
     * Composes the url for an api
     * @param the api to be composed
     */
    private getUrl(api: string): string {
        return `${this.REST_URL}/${api}/`;
    }

    /**
     * Gets pages from backend
     */
    private updatePages() {
        this.$http
            .get<IPage[]>(this.getUrl("pages")).then((response) => {
                this.cachedPages = response.data;
            },
                () => {
                    this.$log.error(`Failure to get ${this.getUrl("pages")}`);
                });
    }

    /**
     * Query the options available for a particular device capability
     * @param capability the capability to be queried
     */
    private getCapabilitiesFromModel(capability: string) {

        this.$http.get<ISelectableOption[]>(`${this.getUrl("deviceOptions")}${capability}`).then((response) => {
            this.cachedCapabilities[capability] = response.data;
        },
            () => {
                this.$log.error(`Failure to get ${capability} device capability`);
            });
    }
}
