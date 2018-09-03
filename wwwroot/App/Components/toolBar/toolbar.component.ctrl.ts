import { ILogService, IRootScopeService } from "angular";
import { ModelUpdate } from "../../Model/ModelEvents";
import { DataService } from "../../Services/DataService";

/**
 * Handles the bindings inside the component
 */
export class ToolBarController {

    /**
     * Define dependencies
     */
    public static $inject =  ["$log", "$rootScope", "dataService"];

    /**
     * Initializes a new instance of the ToolBarController class.
     * @param logService the angular ILogService
     * @param rootScopeService the angular IRootScopeService
     * @param dataService the data service for this application
     */
    constructor(
        private logService: ILogService,
        private rootScopeService: IRootScopeService,
        private dataService: DataService) {}

    /**
     * Calls the add device service
     */
    public addDevice(): void {
        this.dataService.addNewDevice().then((success) => {
            if (success) {
                this.rootScopeService.$broadcast(ModelUpdate.Devices);
                this.logService.log("New device added sucessfully");
            } else {
                this.logService.log("Failed to add new device");
            }
        });
    }
}
