import * as angular from "angular";
import { DataService } from "../../Services/DataService";
import { ModelUpdate } from  "../../Model/ModelEvents";

/**
 * Handles the bindings inside the component
 */
export class ToolBarController {

    /**
     * Initializes a new instance of the ToolBarController class.
     * @param logService the angular ILogService
     * @param rootScopeService the angular IRootScopeService
     * @param dataService the data service for this application     */
    constructor(
        private logService: angular.ILogService,
        private rootScopeService: angular.IRootScopeService,
        private dataService: DataService) {}

    /**
     * Calls the add device service
     */
    addDevice():void {
        this.dataService.addNewDevice().then(success => {
            if (success) {
                this.rootScopeService.$broadcast(ModelUpdate.Devices.toString());
                this.logService.log("New device added sucessfully");
            } else {
                this.logService.log("Failed to add new device");
            }
        });
    }
}
