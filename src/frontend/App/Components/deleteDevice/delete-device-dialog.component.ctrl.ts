import { IComponentController } from "angular";
import { DataService } from "../../Services/DataService";
import { IStateService } from "../../ui-routes";
import { IIdParam } from "../definitions";

interface IDialogParamsId {
    params: IIdParam;
}

export class DeleteDeviceDialogController implements IComponentController {

    public static $inject = [ "dataService" ];

    // from/to bindings
    public resolve: IDialogParamsId;
    public close: () => void;
    public dismiss: () => void;

    public name: string;
    private deviceId: number;

    constructor(private dataService: DataService) {}

    public $onInit() {
        this.deviceId = this.resolve.params.id;
        this.name = this.dataService.devices.find((d) => d.id === this.deviceId).name;
    }

    /**
     * When clicked cancel
     */
    public cancel() {
        this.dismiss();
    }

    /**
     * When clicked ok
     */
    public ok() {
        this.dataService.deleteDevice(this.deviceId);
        this.close();
    }
}
