import { IComponentOptions } from "angular";
import { DevicePanelController } from "./device-panel.component.ctrl";

/**
 * Where the available devices will be displayed
 */
export const DevicePanel: IComponentOptions = {
    bindings: {
        onSelectedDevice: "&",
        selectedDeviceId: "<"
    },
    controller: DevicePanelController,
    templateUrl: "devicePanel/device-panel.template.htm"
};
