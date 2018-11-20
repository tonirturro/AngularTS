import { IComponentOptions } from "angular";
import { ToolBarController } from "./toolbar.component.ctrl";

/**
 * Defines the bar with the program commands
 */
export const ToolBar: IComponentOptions = {
    bindings: {
        editingDevices: "<",
        onAddDevice: "&",
        onClose: "&",
        onEditDevices: "&",
        onEditPages: "&"
    },
    controller: ToolBarController,
    controllerAs: "toolBarController",
    templateUrl: "toolBar/toolbar.template.htm"
};
