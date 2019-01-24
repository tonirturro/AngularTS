import { IComponentController } from "angular";
import { DataService } from "../../Services/DataService";
import { IIdParam } from "../definitions";
import { ModalManager } from "../modal-manager.service";

interface IDialogParamsId {
    params: IIdParam;
}

export class DeleteDeviceDialogController implements IComponentController {

    public static $inject = [ "dataService", "modalManager" ];

    // from/to bindings
    public resolve: IDialogParamsId;

    public name: string;
    private deviceId: number;

    constructor(
        private dataService: DataService,
        private modalManager: ModalManager) {}

    public $onInit() {
        this.deviceId = this.resolve.params.id;
        this.name = this.dataService.devices.find((d) => d.id === this.deviceId).name;
    }

    /**
     * When clicked cancel
     */
    public cancel() {
        this.modalManager.pop();
    }

    /**
     * When clicked ok
     */
    public ok() {
        this.dataService.deleteDevice(this.deviceId);
        this.modalManager.pop();
    }
}
