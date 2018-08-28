import { IComponentOptions } from "angular";
import { ToolBarController } from "./toolbar.component.ctrl";

/**
 * Defines the bar with the program commands
 */
export class ToolBar implements IComponentOptions {
    public templateUrl: string;
    public controller: any;

    /**
     * Initializes a new instance of the ToolBar class.
     */
    constructor() {
        this.templateUrl = "toolBar/toolbar.template.htm";
        this.controller = ToolBarController;
    }
}
