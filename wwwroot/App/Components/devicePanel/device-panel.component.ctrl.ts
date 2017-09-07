import * as angular from "angular";
import { Device } from "../../Model/Device";
import { DataService } from "../../Services/DataService";

/**
 * handles the bindings inside the component
 */
export class DevicePanelController {

    // The devices to be displayed at the panel
    private devices_: Device[];

    /**
     * Initializes a new instance of the DevicePanelController class.
     * @param logService 
     * @param dataService 
     */
    constructor(
        private logService: angular.ILogService,
        private dataService: DataService) {
            this.devices_ = [];
            this.dataService.getDevices().then(devices => {
                this.devices_ = devices;
                logService.log(`Loaded ${this.devices_.length} devices`);
            })
            .catch(reason => {
                logService.error("Failed to load devices");
            });
        }

    /**
     * Gets the available devices
     */
    get devices(): Device[] {
        return this.devices_;
    }
}