import { StateService } from "@uirouter/core";
import { IComponentController, ILogService, IWindowService } from "angular";
import { PageFields } from "../../../common/model";
import { DataService } from "../Services/DataService";
import { DeviceDisplay } from "./devicePanel/DeviceDisplay";
import { ICapabilities } from "./pageGrid/page-grid.component.ctrl";

export interface IDeviceSelection {
    deviceId: number;
}

export class MainPageController implements IComponentController {
    /**
     * Define dependencies
     */
    public static $inject = [ "$state", "$log", "$window", "dataService"];

    public selectedDeviceId: number = -1;
    public devices: DeviceDisplay[] = [];
    public selectedPages: number[] = [];
    public capabilities: ICapabilities = {};
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
        this.loadCapabilities();
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
                }
                this.loadDevices();
            } else {
                this.logService.log(`Failed to delete device id ${deviceId}`);
            }
        });
    }

    public selectPage(pageId: number, multiselection: boolean) {
        if (multiselection && this.selectedPages.length > 0) {
            const indexOfSelectedPage = this.selectedPages.indexOf(pageId);
            const currentSelected = this.selectedPages.concat();
            if (indexOfSelectedPage < 1) {
                currentSelected.push(pageId);
            } else {
                currentSelected.splice(indexOfSelectedPage, 1);
            }
            this.selectedPages = currentSelected;
        } else {
            this.selectedPages = [pageId];
        }
    }

    /**
     * Deletes an existing page
     * @param idTodelete the id for the page to be deleted
     */
    public deletePage(idTodelete: number) {
        this.dataService.deletePage(idTodelete);
    }

    /**
     * Update a particular page field
     * @param field the field to be updated
     * @param newValue the new value
     */
    public updatePageField(field: string, newValue: number) {
        if (this.selectedPages.length > 0) {
            this.dataService.updatePageField(field, this.selectedPages, newValue);
        }
    }

    /**
     * Loads the available capabilities
     */
    private loadCapabilities() {
        this.dataService.getCapabilities(PageFields.PageSize).then((capabilities) => {
            this.capabilities[PageFields.PageSize] = capabilities;
        });
        this.dataService.getCapabilities(PageFields.PrintQuality).then((capabilities) => {
            this.capabilities[PageFields.PrintQuality] = capabilities;
        });
        this.dataService.getCapabilities(PageFields.MediaType).then((capabilities) => {
            this.capabilities[PageFields.MediaType] = capabilities;
        });
        this.dataService.getCapabilities(PageFields.Destination).then((capabilities) => {
            this.capabilities[PageFields.Destination] = capabilities;
        });
    }

    /**
     * Load the existing devices
     */
    private loadDevices() {
        const newDevices = [];
        this.dataService.getDevices().then((devices) => {
            devices.forEach((device) => {
                newDevices.push(new DeviceDisplay(device.id, device.name));
            });
            this.devices = newDevices;

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
