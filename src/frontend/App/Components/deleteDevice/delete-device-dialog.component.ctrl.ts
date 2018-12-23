import { IStateService } from "../../ui-routes";

export class DeleteDeviceDialogController {

    public static $inject = [ "$state" ];

    constructor(private $state: IStateService) {}

    /**
     * When clicked cancel
     */
    public cancel() {
        this.$state.go("^");
    }

    /**
     * When clicked ok
     */
    public ok() {
        this.$state.go("^");
    }
}
