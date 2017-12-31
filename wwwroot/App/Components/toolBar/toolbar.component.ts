import * as angular from "angular";
import { ToolBarController } from "./toolbar.component.ctrl";

/**
 * Defines the bar with the program commands
 */
export class ToolBar implements angular.IComponentOptions {
    public template: string
    public controller: any;

    /**
     * Initializes a new instance of the ToolBar class.
     */
    constructor() {
        this.template = require('./toolbar.template.htm');
        this.controller = ToolBarController;
    }
}