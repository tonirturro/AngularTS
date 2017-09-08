import * as angular from "angular";
import { Device } from "../../Model/Device";
import { DataService } from "../../Services/DataService";
import { ModelUpdate } from  "../../Model/ModelEvents";

/**
 * handles the bindings inside the component
 */
export class DevicePanelController {

    // The devices to be displayed at the panel
    private devices_: Device[];

    /**
     * Initializes a new instance of the DevicePanelController class.
     * @param logService the angular ILogService
     * @param rootScopeService the angular IRootScopeService
     * @param dataService the data service for this application
     */
    constructor(
        private logService: angular.ILogService,
        private rootScopeService: angular.IRootScopeService,
        private dataService: DataService) {
            this.devices_ = [];
            this.dataService.getDevices().then(devices => {
                this.devices_ = devices;
                logService.log(`Loaded ${this.devices_.length} devices`);
            })
            .catch(reason => {
                logService.error("Failed to load devices");
            });

            // Capture model events
            this.rootScopeService.$on(ModelUpdate.Devices.toString(), () => {
                this.dataService.getDevices().then(devices => {
                    this.devices_ = devices;
                    logService.log(`Loaded ${this.devices_.length} devices`);
                })
                .catch(reason => {
                    logService.error("Failed to load devices");
                });
            });
        }

    /**
     * Gets the available devices
     */
    get devices(): Device[] {
        return this.devices_;
    }

    /**
     * Delete the requested device
     * @param deviceId the device to be deleted
     */
    deleteDevice(deviceId: number):void {
        this.dataService.deleteDevice(deviceId).then(sucess => {
            if (sucess) {
                this.logService.log(`Deleted device id ${deviceId}`);
                this.dataService.getDevices().then(devices => {
                    this.devices_ = devices;
                    this.logService.log(`Loaded ${this.devices_.length} devices`);
                })               
            } else {
                this.logService.log(`Failed to delete device id ${deviceId}`);
            }
        });
    }
}