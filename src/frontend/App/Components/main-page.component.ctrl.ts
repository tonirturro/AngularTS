import { IComponentController, ILogService, IWindowService } from "angular";
import { IDevice } from "../../../common/rest";
import { DataService } from "../Services/DataService";
import { IStateService } from "../ui-routes";
import { IModalInstanceService, IModalService, IModalSettings } from "../UiLib/definitions";

export interface IDeviceSelection {
    deviceId: number;
}

export class MainPageController implements IComponentController {
    /**
     * Define dependencies
     */
    public static $inject = ["$state", "$log", "$window", "dataService", "$uiLibModal"];

    public selectedDeviceId: number = -1;
    public selectedPages: number[] = [];
    public editingDevices: boolean = false;

    constructor(
        private $state: IStateService,
        private $log: ILogService,
        private $window: IWindowService,
        private dataService: DataService,
        private $uiLibModal: IModalService) {}

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
        const modalInstance: IModalInstanceService = this.$uiLibModal.open({
            backdrop: "static",
            component: "closeDialog",
            keyboard: false,
            size: "sm"
        } as IModalSettings);

        modalInstance.result.then(() => {
            this.$window.close();
        }, () => {
            this.$log.info("Modal closed");
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
                this.$log.log(`Failed to delete device id ${deviceId}`);
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
