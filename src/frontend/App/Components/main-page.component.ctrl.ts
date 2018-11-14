import { IComponentController, ILogService, IRootScopeService } from "angular";
import { ModelUpdate } from "../Model/ModelEvents";
import { DataService } from "../Services/DataService";
import { DeviceDisplay } from "./devicePanel/DeviceDisplay";

export class MainPageController implements IComponentController {
    /**
     * Define dependencies
     */
    public static $inject = ["$log", "$rootScope", "dataService"];

    public selectedDeviceId: number;
    public devices: DeviceDisplay[] = [];

    // event unsubscription
    private unsubscribeUpdateEvent: () => void;

    constructor(
        private logService: ILogService,
        private rootScopeService: IRootScopeService,
        private dataService: DataService) { }

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
     * Request a device selection change
     * @param deviceId the new device to be selected
     */
    public selectDevice(deviceId: number) {
        this.selectedDeviceId = deviceId;
    }

    /**
     * Request to add a new device
     */
    public addDevice() {
        this.dataService.addNewDevice().then((success) => {
            if (success) {
                this.rootScopeService.$broadcast(ModelUpdate.Devices);
                this.logService.log("New device added sucessfully");
            } else {
                this.logService.log("Failed to add new device");
            }
        });
    }

    /**
     * Delete the requested device
     * @param deviceId the device to be deleted
     */
    public deleteDevice(deviceId: number): void {
        this.dataService.deleteDevice(deviceId).then((sucess) => {
            if (sucess) {
                if (this.selectedDeviceId === deviceId) {
                    this.selectedDeviceId = -1;
                }
                this.loadDevices();
            } else {
                this.logService.log(`Failed to delete device id ${deviceId}`);
            }
        });
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
        })
        .catch((reason) => {
            this.logService.error(`Failed to load devices because : ${reason}`);
        });
    }
}
