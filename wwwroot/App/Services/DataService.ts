import * as angular from "angular"
import { Page } from "../Model/Page";

/*
** Service to access data from the backend
*/
export class DataService {

    /**
     * Initializes a new instance of the DataService class.
     * @param $http is the Angular http service.
     * @param $log is the Angular log services.
     * @param $q is the Angular promise services.
     */
    constructor(
        private $http: angular.IHttpService,
        private $log: angular.ILogService,
        private $q: angular.IQService) {
    }

    /**
     * Gets pages from backend
     */
    getPages():angular.IPromise<Page[]> {

        var deferred = this.$q.defer();

        this.$http.get("REST/pages").then(response => {
            let pages:Page[] = <Page[]>response.data;
            deferred.resolve(pages);
        },
        errors => {
            this.$log.error("Failure to get REST/pages");
            deferred.reject(errors.data);
        });

        return deferred.promise;
    }
}