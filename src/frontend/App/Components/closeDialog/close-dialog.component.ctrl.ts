export class CloseDialogController {
    /**
     * From bindings
     */
    public dismiss: () => void;
    public close: () => void;

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
        this.close();
    }
}
