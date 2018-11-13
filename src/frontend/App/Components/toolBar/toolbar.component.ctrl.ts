/**
 * Handles the bindings inside the component
 */
export class ToolBarController {
    /**
     * Bindings
     */
    public onAddDevice: () => void;

    /**
     * Report add action
     */
    public addDevice(): void {
        this.onAddDevice();
    }
}
