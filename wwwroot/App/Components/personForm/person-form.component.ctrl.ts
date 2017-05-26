import * as angular from "angular";
import { DataService } from "../../Services/DataService";

/**
 * Controls the new person adittion
 */
export class PersonFormController {
    private newGivenName_: string;
    private newFamillyName_: string;

    /**
     * Initializes a new instance of the PersonFormController class
     * @param logService : angular log services
     * @param dataService : back end communication services
     */
    constructor(private logService: angular.ILogService, private dataService: DataService) {
        this.newGivenName_ = "Given Name";
        this.newFamillyName_ = "Familly Name";
    };

    get newGivenName(): string {
        return this.newGivenName_;
    };

    set newGivenName(newValue:string) {
        this.newGivenName_ = newValue;
    };

    get newFamillyName(): string {
        return this.newFamillyName_;
    };

    set newFamillyName(newValue: string) {
        this.newFamillyName_ = newValue;
    };

    /**
     * Adds a new person with the data obtained from the form
     */
    addContact(): void {
        if (this.dataService.addUser(this.newGivenName_, this.newFamillyName_)) {
            this.logService.info(`Added Contact With ID ${this.dataService.maxId}`);
        }
    };
}
