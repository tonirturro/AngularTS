import { IWindowService } from "angular";

export class CloseDialogController {

    public static $inject = [ "$window" ];

    // from/to bindings
    public dismiss: () => void;

    constructor(private $window: IWindowService) {}

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
        this.$window.close();
    }
}
