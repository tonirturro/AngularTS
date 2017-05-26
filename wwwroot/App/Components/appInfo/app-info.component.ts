import * as angular from "angular";
import { AppInfoController } from "./app-info.component.ctrl";

/**
*   Defines the application banner containing information to the user
*/
export class AppInfo implements angular.IComponentOptions {
    public templateUrl: string
    public controller: any;

    /**
     * Initializes a new instance of the AppInfo class
     */
    constructor() {
        this.templateUrl = "App/Components/appInfo/app-info.template.htm";
        this.controller = ["$interval", "dataService", AppInfoController];
    }
}
