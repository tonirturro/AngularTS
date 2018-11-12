
import { IComponentController, ILogService, IRootScopeService } from "angular";

import { IDevice } from "../../../../common/rest";
import { ModelUpdate } from "../../Model/ModelEvents";
import { DataService } from "../../Services/DataService";
import { DeviceDisplay } from "./DeviceDisplay";

/**
 * handles the bindings inside the component
 */
export class DevicePanelController implements IComponentController {

    /**
     * Define dependencies
     */
    public static $inject =  ["$log", "$rootScope", "dataService"];

    /**
     * Bindings
     */
    public selectedDeviceId: number;
    public onSelectedDevice: (data: { deviceId: number } ) => void;

    // The devices to be displayed at the panel
    private devices: DeviceDisplay[];

    // event unsubscription
    private unsubscribeUpdateEvent: () => void;

    /**
     * Initializes a new instance of the DevicePanelController class.
     * @param logService the angular ILogService
     * @param rootScopeService the angular IRootScopeService
     * @param dataService the data service for this application
     */
    constructor(
        private logService: ILogService,
        private rootScopeService: IRootScopeService,
        private dataService: DataService) {}

    /**
     * Gets the available devices
     */
    get Devices(): IDevice[] {
        return this.devices;
    }

    /**
     * Component initialization
     */
    public $onInit() {
        this.loadDevices();

        // Capture model events
        this.unsubscribeUpdateEvent = this.rootScopeService.$on(ModelUpdate.Devices, () => {
            this.loadDevices();
        });
    }

    /**
     * Component termination
     */
    public $onDestroy() {
        this.unsubscribeUpdateEvent();
    }

    /**
     * Delete the requested device
     * @param deviceId the device to be deleted
     */
    public deleteDevice(deviceId: number): void {
        this.dataService.deleteDevice(deviceId).then((sucess) => {
            if (sucess) {
                if (this.selectedDeviceId === deviceId) {
                    this.onSelectedDevice({ deviceId: -1 });
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
        this.onSelectedDevice({ deviceId });
        this.displaySelection();
    }

    /**
     * Load the existing devices
     */
    private loadDevices(): void {
        this.devices = [];
        this.dataService.getDevices().then((devices) => {
            devices.forEach((device) => {
                this.devices.push(new DeviceDisplay(device.id, device.name));
            });

            if (this.devices.length > 0 && this.selectedDeviceId < 0) {
                this.selectedDeviceId = this.devices[0].id;
            }

            this.displaySelection();
        })
        .catch((reason) => {
            this.logService.error(`Failed to load devices because : ${reason}`);
        });
    }

    /**
     * Displays the visual selection
     */
    private displaySelection(): void {
        // Set selected style
        this.devices.forEach((device) => {
            if (device.id === this.selectedDeviceId) {
                device.class = "item-selected";
            } else {
                device.class = "";
            }
        });
    }
}
