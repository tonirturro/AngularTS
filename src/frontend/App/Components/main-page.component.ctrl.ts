import { ILogService, IRootScopeService } from "angular";
import { ModelUpdate } from "../Model/ModelEvents";
import { DataService } from "../Services/DataService";

export class MainPageController {
    /**
     * Define dependencies
     */
    public static $inject =  ["$log", "$rootScope", "dataService"];

    public selectedDeviceId: number;

    constructor(
        private logService: ILogService,
        private rootScopeService: IRootScopeService,
        private dataService: DataService) {}

    public selectDevice(deviceId: number) {
        this.selectedDeviceId = deviceId;
    }

    public addDevice() {
        this.dataService.addNewDevice().then((success) => {
            if (success) {
                this.rootScopeService.$broadcast(ModelUpdate.Devices);
                this.logService.log("New device added sucessfully");
            } else {
                this.logService.log("Failed to add new device");
            }
        });
    }
}
