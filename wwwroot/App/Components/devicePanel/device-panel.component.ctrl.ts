import * as angular from "angular";

import { Device } from "../../Model/Device";
import { ModelUpdate } from "../../Model/ModelEvents";
import { AppService } from "../../Services/AppService";
import { DataService } from "../../Services/DataService";

import { DeviceDisplay } from "./DeviceDisplay";

/**
 * handles the bindings inside the component
 */
export class DevicePanelController {

    /**
     * Define dependencies
     */
    public static $inject =  ["$log", "$rootScope", "appService", "dataService"];

    // The devices to be displayed at the panel
    private devices: DeviceDisplay[];

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
    get Devices(): Device[] {
        return this.devices;
    }

    /**
     * Delete the requested device
     * @param deviceId the device to be deleted
     */
    public deleteDevice(deviceId: number): void {
        this.dataService.deleteDevice(deviceId).then((sucess) => {
            if (sucess) {
                if (this.appService.SelectedDeviceId === deviceId) {
                    this.appService.SelectedDeviceId = -1;
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
    public selectDevice(deviceId: number): void {
        this.appService.SelectedDeviceId = deviceId;
        this.displaySelection();
    }

    /**
     * Load the existing devices
     */
    private loadDevices(): void {
        this.devices = [];
        this.dataService.getDevices().then((devices) => {
            this.devices = [];

            devices.forEach((device) => {
                this.devices.push(new DeviceDisplay(device.id, device.name));
            });

            if (this.devices.length > 0 && this.appService.SelectedDeviceId < 0) {
                this.appService.SelectedDeviceId = this.devices[0].id;
            }

            this.displaySelection();
        })
        .catch((reason) => {
            this.logService.error("Failed to load devices");
        });
    }

    /**
     * Displays the visual selection
     */
    private displaySelection(): void {
        // Set selected style
        this.devices.forEach((device) => {
            if (device.id === this.appService.SelectedDeviceId) {
                device.class = "item-selected";
            } else {
                device.class = "";
            }
        });
    }
}
