import * as angular from "angular";
import { DevicePanelController } from "./device-panel.component.ctrl";

/**
 * Where the available devices will be displayed
 */
export class DevicePanel implements angular.IComponentOptions {
    public templateUrl: string;
    public controller: any;

    /**
     * Initializes a new instance of the DevicePanel class.
     */
    constructor() {
        this.templateUrl = "App/Components/devicePanel/device-panel.template.htm";
        this.controller = ["$log", "$rootScope", "appService", "dataService", DevicePanelController];
    }
}