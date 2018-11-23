import { StateService } from "@uirouter/core";
import { IComponentController, ILogService, IWindowService } from "angular";
import { IDevice } from "../../../common/rest";
import { DataService } from "../Services/DataService";

export interface IDeviceSelection {
    deviceId: number;
}

export class MainPageController implements IComponentController {
    /**
     * Define dependencies
     */
    public static $inject = ["$state", "$log", "$window", "dataService"];

    public selectedDeviceId: number = -1;
    public devices: IDevice[] = [];
    public selectedPages: number[] = [];
    public editingDevices: boolean = false;

    constructor(
        private $state: StateService,
        private logService: ILogService,
        private $window: IWindowService,
        private dataService: DataService) { }

    /**
     * Component initialization
     */
    public $onInit() {
        this.loadDevices();
        this.changeView();
    }

    /**
     * Close main window
     */
    public close() {
        this.$window.close();
    }

    /**
     * Switch to edit devices view
     */
    public editDevices() {
        this.editingDevices = true;
        this.changeView();
    }

    /**
     * Switch to edit pages view
     */
    public editPages(): any {
        this.editingDevices = false;
        this.changeView();
    }

    /**
     * Request a device selection change
     * @param deviceId the new device to be selected
     */
    public selectDevice(deviceId: number) {
        this.selectedDeviceId = deviceId;
        this.changeView();
    }

    /**
     * Request to add a new device
     */
    public addDevice() {
        this.dataService.addNewDevice().then((success) => {
            if (success) {
                this.loadDevices();
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
                    this.changeView();
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
    private loadDevices() {
        this.dataService.getDevices().then((devices: IDevice[]) => {
            this.devices = devices;

            if (this.devices.length > 0 && this.selectedDeviceId < 0) {
                this.selectedDeviceId = this.devices[0].id;
            }
        })
            .catch((reason) => {
                this.logService.error(`Failed to load devices because : ${reason}`);
            });
    }

    /**
     * Selects the edition view
     */
    private changeView() {
        const deviceSelection: IDeviceSelection = { deviceId: this.selectedDeviceId };
        const view = this.editingDevices ? "device" : "pages";
        this.$state.go(view, deviceSelection);
    }
}
