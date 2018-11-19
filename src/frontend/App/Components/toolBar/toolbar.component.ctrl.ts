import { IWindowService } from "angular";

/**
 * Handles the bindings inside the component
 */
export class ToolBarController {
    public static $inject = [ "$window" ];
    /**
     * Bindings
     */
    public onAddDevice: () => void;

    constructor(private $window: IWindowService) {}

    /**
     * Report add action
     */
    public addDevice(): void {
        this.onAddDevice();
    }

    /**
     * Close main window
     */
    public close() {
        this.$window.close();
    }
}
