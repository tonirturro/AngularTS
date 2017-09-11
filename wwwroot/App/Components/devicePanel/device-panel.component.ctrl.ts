import * as angular from "angular";
import { Device } from "../../Model/Device";
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

    // The selected device
    private selectedDevice_:number;

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
            this.loadDevices();

            if (this.devices_.length > 0) {
                this.selectedDevice_ = this.devices_[0].id;
            }

            this.displaySelection();

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
        this.selectedDevice_ = deviceId;
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
                this.devices.push(new DeviceDisplay(device.id, device.name));
            });
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
            if (device.id === this.selectedDevice_) {
                device.class = "item-selected";
            } else {
                device.class = "";
            }
        });
    }
}