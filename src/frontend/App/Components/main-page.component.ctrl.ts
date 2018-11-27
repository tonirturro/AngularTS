import { StateService } from "@uirouter/core";
import { IComponentController, ILogService, IWindowService } from "angular";
import { IModalService, IModalSettings, IModalInstanceService } from "angular-ui-bootstrap";
import { IDevice } from "../../../common/rest";
import { DataService } from "../Services/DataService";

export interface IDeviceSelection {
    deviceId: number;
}

export class MainPageController implements IComponentController {
    /**
     * Define dependencies
     */
    public static $inject = ["$state", "$log", "$window", "dataService", "$uibModal"];

    public selectedDeviceId: number = -1;
    public selectedPages: number[] = [];
    public editingDevices: boolean = false;

    constructor(
        private $state: StateService,
        private logService: ILogService,
        private $window: IWindowService,
        private dataService: DataService,
        private $uibModal: IModalService) {}

    /**
     * Exposes the devices from the data service
     */
    public get devices(): IDevice[] {
        return this.dataService.devices;
    }

    /**
     * Component initialization
     */
    public $onInit() {
        this.changeView();
    }

    /**
     * Close main window
     */
    public close() {
        const modalInstance: IModalInstanceService = this.$uibModal.open({
            animation: false,
            component: "closeDialog"
        } as IModalSettings);

        modalInstance.result.then(() => {
            this.$window.close();
        });
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
        this.dataService.addNewDevice();
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
            } else {
                this.logService.log(`Failed to delete device id ${deviceId}`);
            }
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
