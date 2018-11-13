import { IComponentOptions } from "angular";
import { ToolBarController } from "./toolbar.component.ctrl";

/**
 * Defines the bar with the program commands
 */
export const ToolBar: IComponentOptions = {
    bindings: {
        onAddDevice: "&",
    },
    controller: ToolBarController,
    templateUrl: "toolBar/toolbar.template.htm"
};
