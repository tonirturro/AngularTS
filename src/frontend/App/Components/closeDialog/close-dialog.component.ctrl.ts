import { IWindowService } from "angular";
import { ModalManager } from "../../Services/ModalManager";

export class CloseDialogController {

    public static $inject = [ "$window", "modalManager" ];

    // from/to bindings
    public dismiss: () => void;

    constructor(
        private $window: IWindowService,
        private modalManager: ModalManager) {}

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
        this.$window.close();
    }
}
