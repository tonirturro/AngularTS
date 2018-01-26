/**
 * Service hosting the bussiness rules
 */
export class AppService {

    /**
     * Internal Repository
     */
    private selectedDeviceId: number;

    /**
     * Initializes a new instance of the AppService class
     */
    constructor() {
        this.selectedDeviceId = -1;
    }

    /**
     * Device Id getter
     */
    get SelectedDeviceId(): number {
        return this.selectedDeviceId;
    }

    /**
     * Device Id setter
     */
    set SelectedDeviceId(newSelectedId: number) {
        this.selectedDeviceId = newSelectedId;
    }
}
