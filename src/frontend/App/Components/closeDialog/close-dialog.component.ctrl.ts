import { IWindowService } from "angular";

export class CloseDialogController {

    public static $inject = [ "$window" ];

    /**
     * From bindings
     */
    public dismiss: () => void;
    public close: () => void;

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
        this.close();
    }
}
