
import { IComponentController } from "angular";
import { DeviceDisplay } from "./DeviceDisplay";

interface IReportDeviceId {
    deviceId: number;
}

/**
 * handles the bindings inside the component
 */
export class DevicePanelController implements IComponentController {

    /**
     * Bindings
     */
    public devices: DeviceDisplay[];
    public selectedDeviceId: number;
    public onDeleteDevice: (data: IReportDeviceId ) => void;
    public onSelectedDevice: (data: IReportDeviceId ) => void;

    /**
     * Component initialization
     */
    public $onInit() {
        this.displaySelection();
    }

    /**
     * Component update
     */
    public $onChanges(changes: any) {
        if (changes.selectedDeviceId || changes.devices) {
            this.displaySelection();
        }
    }

    /**
     * Delete the requested device
     * @param deviceId the device to be deleted
     */
    public deleteDevice(deviceId: number): void {
        this.onDeleteDevice({ deviceId });
    }

    /**
     * Selects a device
     * @param deviceId the id for the selected device
     */
    public selectDevice(deviceId: number): void {
        this.onSelectedDevice({ deviceId });
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
