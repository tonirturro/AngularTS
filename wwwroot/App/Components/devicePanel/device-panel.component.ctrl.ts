import * as angular from "angular";
import { Device } from "../../Model/Device";
import { AppService } from "../../Services/AppService";
import { DataService } from "../../Services/DataService";
import { ModelUpdate } from  "../../Model/ModelEvents";

/**
 * Data to be displayed for a device
 */
class DeviceDisplay {
    id: number;
    name: string;
    class: string;

    // Constructor
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.class = "";
    }
}

/**
 * handles the bindings inside the component
 */
export class DevicePanelController {

    // The devices to be displayed at the panel
    private devices_: DeviceDisplay[];

    /**
     * Initializes a new instance of the DevicePanelController class.
     * @param logService the angular ILogService
     * @param rootScopeService the angular IRootScopeService
     * @param appService the bussiness rules for this application
     * @param dataService the data service for this application
     */
    constructor(
        private logService: angular.ILogService,
        private rootScopeService: angular.IRootScopeService,
        private appService: AppService,
        private dataService: DataService) {
            this.loadDevices();

            // Capture model events
            this.rootScopeService.$on(ModelUpdate.Devices.toString(), () => {
                this.loadDevices();
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
                if (this.appService.selectedDeviceId === deviceId) {
                    this.appService.selectedDeviceId = -1;
                }
                this.loadDevices();           
            } else {
                this.logService.log(`Failed to delete device id ${deviceId}`);
            }
        });
    }

    /**
     * Selects a device
     * @param deviceId the id for the selected device
     */
    selectDevice(deviceId: number):void {
        this.appService.selectedDeviceId = deviceId;
        this.displaySelection();
    }

    /**
     * Load the existing devices
     */
    private loadDevices():void {
        this.devices_ = [];
        this.dataService.getDevices().then(devices => {
            this.devices_ = []

            devices.forEach(device => {
                this.devices_.push(new DeviceDisplay(device.id, device.name));
            });

            if (this.devices_.length > 0 && this.appService.selectedDeviceId < 0) {
                this.appService.selectedDeviceId = this.devices_[0].id;
            }

            this.displaySelection();
        })
        .catch(reason => {
            this.logService.error("Failed to load devices");
        });        
    }

    /**
     * Displays the visual selection
     */
    private displaySelection(): void {
        // Set selected style
        this.devices_.forEach(device => {
            if (device.id === this.appService.selectedDeviceId) {
                device.class = "item-selected";
            } else {
                device.class = "";
            }
        });
    }
}