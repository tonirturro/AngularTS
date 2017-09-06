import * as angular from "angular";
import { DataService } from "../../Services/DataService";

/**
 * Handles the bindings inside the component
 */
export class ToolBarController {

    /**
     * Initializes a new instance of the ToolBarController class.
     * @param logService 
     * @param dataService 
     */
    constructor(
        private logService: angular.ILogService,
        private dataService: DataService) {}

    /**
     * Calls the add device service
     */
    addDevice():void {
        this.dataService.addNewDevice().then(success => {
            if (success) {
                this.logService.log("New device added sucessfully");
            } else {
                this.logService.log("Failed to add new device");
            }
        });
    }
}
