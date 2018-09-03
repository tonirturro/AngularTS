import { IComponentOptions } from "angular";
import { ToolBarController } from "./toolbar.component.ctrl";

/**
 * Defines the bar with the program commands
 */
export const ToolBar: IComponentOptions = {
    controller: ToolBarController,
    templateUrl: "toolBar/toolbar.template.htm"
};
