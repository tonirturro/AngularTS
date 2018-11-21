import { IComponentOptions } from "angular";
import { DeviceEditController } from "./device-edit.component.ctrl";

export const DeviceEdit: IComponentOptions = {
    bindings: {
        selectedDeviceId: "<"
    },
    controller: DeviceEditController,
    controllerAs: "deviceEditController",
    templateUrl: "deviceEdit/device-edit.template.htm"
};
